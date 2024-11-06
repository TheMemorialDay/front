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
	likeList: string[];
}