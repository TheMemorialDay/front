//# userId Search result store

import { create } from "zustand";

interface IdSearchResult {
	zusName: String;
	setZusName: (zusName: String) => void;
	zusTelNumber: String;
	setZusTelNumber: (zusTelNumber: String) => void;
	zusUserId: String;
	setZusUserId: (zusUserId: String) => void 
}

const useIdSearchResult = create<IdSearchResult>(set => ({
	zusName: '',
	zusTelNumber: '',
	zusUserId: '',
	setZusName: (zusName: String) => set(state => ({...state, zusName})),
	setZusTelNumber: (zusTelNumber: String) => set(state => ({...state, zusTelNumber})),
	setZusUserId: (zusUserId: String) => set(state => ({...state, zusUserId}))
}))

export default useIdSearchResult;