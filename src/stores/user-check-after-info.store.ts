//# 마이페이지 유저 인증 후 유저 정보 불러오기 위한 zustand store

import { create } from "zustand";

interface UserInfo {
	userId: string;
	password: string;
	name: string;
	birth: string;
	gender: string;
	telNumber: string;
	setUserId: (userId: string) => void;
	setPassword: (password: string) => void;
	setName: (name: string) => void;
	setBirth: (birth: string) => void;
	setGender: (gender: string) => void;
	setTelNumber: (telNumber: string) => void;
}

const useUserInfoZustand = create<UserInfo>(set => ({
	userId: '',
	password: '',
	name: '',
	birth: '',
	gender: '',
	telNumber: '',
	setUserId: (userId: string) => set(state => ({...state, userId})),
	setPassword: (password: string) => set(state => ({...state, password})),
	setName: (name: string) => set(state => ({...state, name})),
	setBirth: (birth: string) => set(state => ({...state, birth})),
	setGender: (gender: string) => set(state => ({...state, gender})),
	setTelNumber: (telNumber: string) => set(state => ({...state, telNumber}))
}))

export default useUserInfoZustand;