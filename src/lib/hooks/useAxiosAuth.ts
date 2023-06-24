"use client";

import { axiosAuth } from "../axios";
import { useEffect } from "react";
import { useRefreshToken } from "./useAxiosRefreshToken";
import { accessTokenState, useSsrComplectedState } from "../recoil";
import { useRecoilState } from "recoil";

const useAxiosAuth = () => {
  const refreshToken = useRefreshToken();
  const setSsrCompleted = useSsrComplectedState();

  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  useEffect(setSsrCompleted, [setSsrCompleted]);
  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          await refreshToken();
          prevRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return axiosAuth(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refreshToken]);

  return axiosAuth;
};

export default useAxiosAuth;