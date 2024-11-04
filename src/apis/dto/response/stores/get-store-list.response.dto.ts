import { StoreComponentProps } from "../../../../types";
import ResponseDto from "../response.dto";


export default interface GetStoreListResponseDto extends ResponseDto {
  stores: StoreComponentProps[];
}