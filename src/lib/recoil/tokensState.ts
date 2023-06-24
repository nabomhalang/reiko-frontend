
import { atom } from "recoil";
import { persistAtomEffect } from "./ssrState";

export const accessTokenState = atom<string | null>({
  key: "AccessToken",
  default: null,
  effects_UNSTABLE: [persistAtomEffect],
});