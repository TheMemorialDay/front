import ResponseDto from "../response.dto";

// interface: get review list response dto //
export default interface GetReviewListResponseDto extends ResponseDto {
    reviews: Review[];
}

export interface Review {
    reviewRating: number;
    reviewDay: string;
    reviewContents: string;
    productName: string;
    imageUrls: string[];
}