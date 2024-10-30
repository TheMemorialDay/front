import { StoreComponentProps } from "../../../../types";
import StoreInfor from "../../../../types/store-infor.interface";
import ResponseDto from "../response.dto";


export default interface GetStoreListResponseDto extends ResponseDto {
  stores: StoreComponentProps[];
}