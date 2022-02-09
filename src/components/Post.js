import React from "react";
import { Grid, Image, Text, Button } from "../elements";

import {history} from "../redux/configureStore";

 const Post = (props) => {
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
          </Grid>
        </Grid>
        <Grid padding="16px">
          <Text>{props.contents}</Text>
        </Grid>
        <Grid>
          <Image shape="rectangle" src={props.image_url} />
        </Grid>
        <Grid padding="16px">
          <Text margin="0px" bold>
            댓글 {props.comment_cnt}개
          </Text>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Post.defaultProps = {
    user_info: {
        user_name: "윤쓰윤쓰",
        user_profile: "https://i.pinimg.com/originals/af/7b/de/af7bde50489a2cb932a98741b877704b.jpg",
    },
    image_url: "https://mblogthumb-phinf.pstatic.net/MjAxOTEwMDlfMjk3/MDAxNTcwNTczNDQxMjI1.zar5OtCPpcYARaR7-HH9D-U2Mbr58DrQRAS_pgKP0vYg.vc9wfKhXGmwuWh54z7qd0s3jzzSVsYA9kzCSQT36FNwg.JPEG.kwoun486/IMG_8155.JPG?type=w800",
    contents: "짱구는 흰둥이를 좋아해",
    comment_cnt: 10,
    insert_dt: "2022-02-07 10:00:00",
};

export default Post;