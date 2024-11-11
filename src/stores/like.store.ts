import { create } from "zustand";

interface LikeStateStore {
	likeCount: {[storeNumber: string]:number};
	setLikeCount: (storeNumber: string, count: number) => void;
};

const useLikeStateStore = create<LikeStateStore>(set => ({
	likeCount: {},
	setLikeCount: (storeNumber: string, count: number) => set(state => ({...state.likeCount, [storeNumber]: count}))
}));

export default useLikeStateStore;