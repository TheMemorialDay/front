import ResponseDto from "../response.dto";
import Infoes from "./get-infoes";

export default interface getMypageLikeStoreReviewNRating extends ResponseDto{
    reviewNRatings: Infoes[];
}