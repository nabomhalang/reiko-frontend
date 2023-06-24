
"use client";

import React from "react";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useRecoilState } from "recoil";
import { accessTokenState } from "@/lib/recoil/tokensState";
import { useNotice } from "@/lib/store/notice.store";

const ServerPage = () => {
  const axiosAuth = useAxiosAuth();
  const { successed, failed } = useNotice();
  const [posts, setPosts] = React.useState([]);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  const fetchPost = async () => {
    try {
      const res = await axiosAuth.post('/utils/posts');
      setPosts(res.data);
      console.log(res.data);
    } catch (err: any) {
      console.log(err);
      failed({ header: 'Error', message: err.response.data.message || 'Error' });
    }
  }

  return (
    <>
      <button onClick={fetchPost}>Get users posts</button>
      {posts && JSON.stringify(posts)}
    </>
  )
};

export default ServerPage;