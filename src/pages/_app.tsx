"use client";

import "@/styles/globals.css";
import { AppProps } from "next/app";
import NoticeProvider from "@/lib/store/notice.store";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import Notice from "@/components/notice";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <RecoilRoot>
      <NoticeProvider>
        <Notice />
        <Component {...pageProps} />
      </NoticeProvider>
    </RecoilRoot>
  );
}