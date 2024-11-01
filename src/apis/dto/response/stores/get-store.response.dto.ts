import ResponseDto from "../response.dto";


export default interface GetStoreResponseDto extends ResponseDto {
  storeNumber: number;
  userId: string;
  storeName: string;
  storeIntroduce: string | null;
  storeParticular: string | null;
  storeContact: string | null;
  storeCaution: string | null;
  storeAddress: string;
  storeDetailAddress: string;
  storeGugun: string;
  storeDong: string;
  storeLatitude: string;
  storeLongtitude: string;
  storeRating: number;
  storeTel: string | null;
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