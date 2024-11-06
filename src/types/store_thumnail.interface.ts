//# 스토어 섬네일 정보 리스트

export default interface StoreComponentProps {
	storeNumber: number;
	storeImageUrl: string;
	storeName: string;
	reviewCount: number;
	reviewRating: number;
	storeGugun: string;
	storeDong: string;
	likeCount: number;
	mondayOpen: string;
	mondayLast: string;
	tuesdayOpen: string;
	tuesdayLast: string;
	wednesdayOpen: string;
	wednesdayLast: string;
	thursdayOpen: string;
	thursdayLast: string;
	fridayOpen: string;
	fridayLast: string;
	saturdayOpen: string;
	saturdayLast: string;
	sundayOpen: string;
	sundayLast: string;
	// 테마 태그 들고오기 -> back에 store back 관련 자료에 추가해서 들고오기.
	likeList: string[];
	productToday: string[];
	productTag: string[];
	themes: string[][];
}