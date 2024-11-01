import { create } from "zustand";
import StoreInfor from "../types/store-infor.interface";
import { StoreComponentProps } from "../types";


interface StoreState {
  stores: StoreComponentProps[]; // stores 배열
  sortBy: string; // 정렬 기준
  sortedStores: StoreComponentProps[]; // 정렬된 stores 배열
  setStores: (newStores: StoreComponentProps[]) => void; // stores 설정 함수
  setSortBy: (sortBy: string) => void; // 정렬 기준 설정 함수
}

const sortStores = (stores: StoreComponentProps[], sortBy: string) => {
  switch (sortBy) {
    case 'review': // 리뷰 순
      return [...stores].sort((a, b) => b.reviewCount - a.reviewCount);

    case 'like': // 찜 순
      return [...stores].sort((a, b) => b.likeCount - a.likeCount);

    case 'name': // 가게 이름 가나다순
      return [...stores].sort((a, b) => a.storeName.localeCompare(b.storeName, 'ko'));

    default:
      return stores;
  }
}

const useSortStore = create<StoreState>((set) => ({
  stores: [] as StoreComponentProps[], // 상점 리스트
  sortBy: 'none',
  sortedStores: [] as StoreComponentProps[], // 정렬된 상점 리스트
  // 
  // 상점 데이터 설정 함수
  setStores: (newStores: StoreComponentProps[]) => set((state) => ({
    stores: newStores,
    sortedStores: sortStores(newStores, state.sortBy),
  })),

  // 정렬 기준 설정 함수
  setSortBy: (sortBy: string) => set((state) => ({
    sortBy,
    sortedStores: sortStores(state.stores, sortBy),
  })),

}));

export default useSortStore;