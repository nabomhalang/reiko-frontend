import { atom } from "recoil";
import { persistAtomEffect } from "./ssrState";

export const userRoomState = atom<Array<JSON> | null>({
    key: "userRoom",
    default: null,
    effects_UNSTABLE: [persistAtomEffect],
});