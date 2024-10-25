export default interface StoreInfor {
  storeNumber: number;
  userId: string;
  storeName: string;
  storeGuGun: string;
  storeDong: string;
  storeRating: number;
  reviewCount: number;
  likeCount: number;
  storeImageUrl: string;
  sundayOpen?: string;
  sundayLast?: string;
  mondayOpen?: string;
  mondayLast?: string;
  tuesdayOpen?: string;
  tuesdayLast?: string;
  wednesdayOpen?: string;
  wednesdayLast?: string;
  thursdayOpen?: string;
  thursdayLast?: string;
  fridayOpen?: string;
  fridayLast?: string;
  saturdayOpen?: string;
  saturdayLast?: string;
}