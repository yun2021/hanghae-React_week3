// 액션을 편하게 만들어주는, 리듀서를 편하게 만들어주는
import { createAction, handleActions } from "redux-actions";
// 불변성 관리를 편하게 해주는
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import moment from "moment";

import { actionCreators as imageActions } from "./image";

// actions: 액션타입 만들기
// 목록 가져오기
const SET_POST = "SET_POST";
// 포스트 추가하기
const ADD_POST = "ADD_POST";
// 포스트 수정하기
const EDIT_POST = "EDIT_POST";
// 포스트 삭제하기
const DELETE_POST = "DELETE_POST";
// 포스트 로딩
const LOADING = "LOADING";

// action creators: 액션 생성 함수 만들기
const setPost = createAction(SET_POST, (post_list, paging) => ({ post_list, paging }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));
const deletePost = createAction(DELETE_POST, (post_id) => ({ post_id }));
const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

//initialState 만들기
const initialState = {
  list: [],
  paging: { start: null, next: null, size: 3 },
  is_loading: false,
};

const initialPost = {
  // id: 0,
  // uesr_info: {
  //   user_name: "miri",
  //   user_profile:
  //     "https://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2021/12/29/Ouc00W5WCPWU637764128299973913.jpg",
  // },
  image_url:
    "https://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2021/12/29/Ouc00W5WCPWU637764128299973913.jpg",
  contents: "",
  comment_cnt: 0,
  layout: "bottom",
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
};

//포스트 삭제하기
const deletePostFB = (post_id = null) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("게시물 정보가 없어요!");
      return;
    }
    const postDB = firestore.collection("post");
    postDB
      .doc(post_id)
      .delete()
      .then(() => {
        dispatch(deletePost(post_id));
        history.replace("/");
      })

      .catch((error) => {
        window.alert("앗! 게시물 삭제에 문제가 있어요!");
        console.log("앗! 게시물 삭제에 문제가 있어요!", error);
      });
  };
};

//포스트 수정하기
const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("게시물 정보가 없어요!");
      return;
    }
    //preview가져오기
    const _image = getState().image.preview;

    //게시글 정보 가져오기
    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_idx];

    console.log(_post);

    const postDB = firestore.collection("post");

    if (_image === _post.image_url) {
      postDB
        .doc(post_id)
        .update(post)
        .then((doc) => {
          dispatch(editPost(post_id, { ...post }));
          history.replace("/");
        });

      return;
    } else {
      const user_id = getState().user.user.uid;
      const _upload = storage
        //파일 이름을 유저id와 현재시간을 밀리초로 넣어주기(중복방지)
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");

      _upload.then((snapshot) => {
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            dispatch(imageActions.uploadImage(url));
            return url;
          })
          .then((url) => {
            postDB
              .doc(post_id)
              .update({ ...post, image_url: url })
              .then((doc) => {
                dispatch(editPost(post_id, { ...post, image_url: url }));
                history.replace("/");
              });
          })
          .catch((error) => {
            window.alert("앗! 이미지 업로드에 문제가 있어요!");
            console.log("앗! 이미지 업로드에 문제가 있어요!", error);
          });
      });
    }
  };
};

const addPostFB = (contents = "", layout = "") => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    //getState()로 store의 상태값에 접근
    const _user = getState().user.user;

    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };

    const _post = {
      ...initialPost,
      layout,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    const _image = getState().image.preview;

    //문자열에서 업로드
    const _upload = storage
      //파일 이름을 유저id와 현재시간을 밀리초로 넣어주기(중복방지)
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");

    _upload.then((snapshot) => {
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          console.log(url);
          dispatch(imageActions.uploadImage(url));
          return url;
        })
        .then((url) => {
          postDB
            .add({ ...user_info, ..._post, image_url: url })
            .then((doc) => {
              let post = { user_info, ..._post, id: doc.id, image_url: url };
              //리덕스에 넣어주기
              dispatch(addPost(post));
              history.replace("/");

              dispatch(imageActions.setPreview(null));
            })
            .catch((error) => {
              window.alert("앗! 포스트 작성에 문제가 있어요!");
              console.log("post 작성에 실패했어요!", error);
            });
        })
        .catch((error) => {
          window.alert("앗! 이미지 업로드에 문제가 있어요!");
          console.log("앗! 이미지 업로드에 문제가 있어요!", error);
        });
    });
  };
};

const getPostFB = (start = null, size=3) => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    
    let _paging = getState().post.paging;
    if (_paging.start && !_paging.next) {
      return;
    }

    dispatch(loading(true));
    
    let query = postDB.orderBy("insert_dt", "desc");

    if(start){
      query = query.startAt(start);
    }

    //데이터 가져오기
    query.limit(size+1).get().then((docs) => {
      let post_list = [];

      let paging = {
        start: docs.docs[0],
        next: docs.docs.length === size+1? docs.docs[docs.docs.length - 1] : null,
        size: size,
      };

      docs.forEach((doc) => {
        let _post = {
          id: doc.id,
          ...doc.data(),
        };
        //데이터 모양 맞추기
        let post = {
          id: doc.id,
          user_info: {
            user_name: _post.user_name,
            user_profile: _post.user_profile,
            user_id: _post.user_id,
          },
          contents: _post.contents,
          image_url: _post.image_url,
          comment_cnt: _post.comment_cnt,
          insert_dt: _post.insert_dt,
          layout: _post.layout,
        };
        post_list.push(post);
      });

      post_list.pop();

      dispatch(setPost(post_list, paging));
    });
  };
};

//reducer
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(...action.payload.post_list);
        draft.paging = action.payload.paging;
        draft.is_loading = false;
      }),
    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        //unshift는 배열 맨 앞에 데이터 넣어줌
        draft.list.unshift(action.payload.post);
      }),
    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        //리스트에서 몇번째를 고칠건지
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),
    [DELETE_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = draft.list.filter((l) => l.id !== action.payload.post_id);
      }),
    [LOADING]: (state, action) => produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      })
  },
  initialState
);

// action creator export
const actionCreators = {
  setPost,
  addPost,
  getPostFB,
  addPostFB,
  editPostFB,
  deletePostFB,
};

export { actionCreators };