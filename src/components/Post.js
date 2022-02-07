import React from "react";
// import가 많아지면 너무 길어지므로 index.js에 모아주고
// 여기에서는 한 줄로 모아 import하면 편리함
// import Grid from "../elements/Grid";
// import Image from "../elements/Image";
// import Text from "../elements/Text";

import { Grid, Image, Text } from "../elements";

const Post = (props) => {

    return (
        <React.Fragment>
            <Grid>
                <Grid is_flex>
                    <Image shape="circle" src={props.src}/>
                    <Text bold>{props.user_info.user_name}</Text>
                    <Text>{props.insert_dt}</Text>
                </Grid>
                <Grid padding="16px">
                    <Text>{props.contents}</Text>
                </Grid>
                <Grid>
                    <Image shape="rectangle" src={props.src}/>
                </Grid>
                <Grid padding="16px">
                    <Text bold>댓글 {props.comment_cnt}개</Text>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

Post.defaultProps = {
    user_info: {
        user_name: "shinzzang",
        user_profile: "https://mblogthumb-phinf.pstatic.net/MjAxOTEwMDlfMjk3/MDAxNTcwNTczNDQxMjI1.zar5OtCPpcYARaR7-HH9D-U2Mbr58DrQRAS_pgKP0vYg.vc9wfKhXGmwuWh54z7qd0s3jzzSVsYA9kzCSQT36FNwg.JPEG.kwoun486/IMG_8155.JPG?type=w800",
    },
    image_url: "https://mblogthumb-phinf.pstatic.net/MjAxOTEwMDlfMjk3/MDAxNTcwNTczNDQxMjI1.zar5OtCPpcYARaR7-HH9D-U2Mbr58DrQRAS_pgKP0vYg.vc9wfKhXGmwuWh54z7qd0s3jzzSVsYA9kzCSQT36FNwg.JPEG.kwoun486/IMG_8155.JPG?type=w800",
    contents: "짱구는 흰둥이를 좋아해",
    comment_cnt: 10,
    insert_dt: "2022-02-07 10:00:00",
};

export default Post;