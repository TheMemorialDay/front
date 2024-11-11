//# 찜한 가게 리스트

export default interface MyStoreLikeComponentProps {
  userId: string;
  storeNumber: number;
  storeImageUrl: string;
  storeName: string;
  reviewCount: number | null;
  reviewRating: number | null;
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