import MyStoreLikeComponentProps from "../../../../types/mypage-likelist.interface";
import ResponseDto from "../response.dto";


export default interface GetMyPageLikeStoreListResponseDto extends ResponseDto {
  likes: MyStoreLikeComponentProps[];
}