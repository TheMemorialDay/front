import { create } from "zustand";

//* 스토어 메인 필터링 상태들

interface StoreSearchStore {
	selectedTag: string;
	setSelectedTag: (selectedTag: string) => void;
	
	selectedThemes: string[];
	setSelectedThemes: (selectedThemes: string[]) => void;
	
	selectedWeekdays: string[];
	setSelectedWeekdays: (selectedWeekdays: string[]) => void;
	
	selectedGugun: string;
	setSelectedGugun: (selectedGugun: string) => void;
	
	selectedDong: string;
	setSelectedDong: (selectedDong: string) => void;
	
	dongList: string[];
	setDongList: (dongList: string[]) => void;
	
	productToday: boolean;
	setProductToday: (productToday: boolean) => void;
	
	mainSearch: string;
	setMainSearch: (mainSearch: string) => void;

	initStoreSearch: () => void;
}

const useStore = create<StoreSearchStore>(set => ({
	selectedTag: '',
	setSelectedTag: (selectedTag: string) => set(state => ({ ...state, selectedTag })),
	
	selectedThemes: [],
	setSelectedThemes: (selectedThemes: string[]) => set(state => ({ ...state, selectedThemes })),
	
	selectedWeekdays: [],
	setSelectedWeekdays: (selectedWeekdays: string[]) => set(state => ({ ...state, selectedWeekdays })),
	
	selectedGugun: '',
	setSelectedGugun: (selectedGugun: string) => set(state => ({ ...state, selectedGugun })),
	
	selectedDong: '',
	setSelectedDong: (selectedDong: string) => set(state => ({ ...state, selectedDong })),
	
	dongList: [],
	setDongList: (dongList: string[]) => set(state => ({ ...state, dongList })),
	
	productToday: false,
	setProductToday: (productToday: boolean) => set(state => ({ ...state, productToday })),
	
	mainSearch: '',
	setMainSearch: (mainSearch: string) => set(state => ({ ...state, mainSearch })),

	initStoreSearch: () => set(state => ({ selectedTag: '', selectedThemes: [], selectedWeekdays: [], selectedGugun: '', selectedDong: '', dongList: [], productToday: false, mainSearch: '' }))
}))

export default useStore;