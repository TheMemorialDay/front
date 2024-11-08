import ResponseDto from "../response.dto";
import MyReviews from "./my-reivew";

// interface: get my review list response dto //
export default interface GetMyReviewListResponseDto extends ResponseDto {
    myReviews: MyReviews[];
}