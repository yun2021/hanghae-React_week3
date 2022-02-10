import React from "react";
import { Grid, Image, Text, Button } from "../elements";

import {history} from "../redux/configureStore";
import { useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";

 const Post = (props) => {
  const dispatch = useDispatch();

  //게시글 삭제하기
  const deletePost = () => {
    dispatch(postActions.deletePostFB(props.id));
  };

  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex padding="16px">
          <Grid is_flex width="auto">
            <Image shape="circle" src={props.src} />
            <Text bold>{props.user_info.user_name}</Text>
          </Grid>
          <Grid is_flex width="auto">
            <Text>{props.insert_dt}</Text>
            {props.is_me && (
              <Button width="auto" margin="4px" padding="4px" _onClick={() => {
                history.push(`/write/${props.id}`);
              }}>
                수정
              </Button>
            )}
            {props.is_me && (
              <Button
                width="auto"
                padding="4px"
                margin="0px 5px"
                _onClick={deletePost}
              >
                삭제
              </Button>
            )}
          </Grid>
        </Grid>
        {/* 레이아웃이 right 일때 게시글 형태 */}
        {props.layout === "right" && (
          <Grid is_flex padding="16px 0px">
            <Grid padding="16px">
              <Text textAlign bold>
                {props.contents}
              </Text>
            </Grid>
            <Image shape="rectangle" src={props.image_url} />
          </Grid>
        )}
        {/* 레이아웃이 left 일때 게시글 형태 */}
        {props.layout === "left" && (
          <Grid is_flex padding="16px 0px">
            <Image shape="rectangle" src={props.image_url} />
            <Grid padding="16px">
              <Text textAlign bold>
                {props.contents}
              </Text>
            </Grid>
          </Grid>
        )}
        {/* 레이아웃이 bottom 일때 게시글 형태 */}
        {props.layout === "bottom" && (
          <Grid padding="16px 0px">
            <Grid padding="5px 16px">
              <Text bold>{props.contents}</Text>
            </Grid>
            <Image shape="rectangle" src={props.image_url} />
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
};

Post.defaultProps = {
    user_info: {
        user_name: "윤쓰윤쓰",
        user_profile: "https://mblogthumb-phinf.pstatic.net/20160825_278/bringiton85_14720883013737s9Jg_PNG/2016-08-06_15%3B36%3B49.PNG?type=w800",
    },
    image_url: "https://mblogthumb-phinf.pstatic.net/MjAxOTEwMDlfMjk3/MDAxNTcwNTczNDQxMjI1.zar5OtCPpcYARaR7-HH9D-U2Mbr58DrQRAS_pgKP0vYg.vc9wfKhXGmwuWh54z7qd0s3jzzSVsYA9kzCSQT36FNwg.JPEG.kwoun486/IMG_8155.JPG?type=w800",
    contents: "짱구는 흰둥이를 좋아해",
    comment_cnt: 10,
    insert_dt: "2022-02-07 10:00:00",
};

export default Post;