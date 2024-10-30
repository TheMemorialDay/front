// interface: patch store request Body dto //
export default interface PatchStoreRequestDto {
  userId: string;
  storeName: string;
  storeIntroduce: string;
  storeParticular: string;
  storeContact: string;
  storeCaution: string;
  storeAddress: string;
  storeGugun: string;
  storeDong: string;
  storeLatitude: string;
  storeLongtitude: string;
  storeTel: string;
  storeRating: number;
  reviewCount: number;
  likeCount: number;
  storeImageUrl: string;
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
}