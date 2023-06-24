

"use client";

import axios from "@/lib/axios";
import { accessTokenState, useSsrComplectedState } from "../recoil";
import { useRecoilState } from "recoil";
import { useEffect } from "react";

export const useRefreshToken = () => {
  const setSsrCompleted = useSsrComplectedState();
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  useEffect(setSsrCompleted, [setSsrCompleted]);

  const refreshToken = async () => {
    const res = await axios.post("/auth/refresh", null, { withCredentials: true });

    if (res.status === 200 && res.data.accessToken) {
      setAccessToken(res.data.accessToken);
    }
  }

  return refreshToken;
}