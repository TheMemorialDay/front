// interface: post review request dto body //
export default interface PostReviewRequestDto {
    orderCode: string;
    reviewRating: number | null;
    reviewDay: Date;
    reviewContents: string;
    storeName: string;
    productName: string;
    userId: string;
    imageUrls: string[];
}