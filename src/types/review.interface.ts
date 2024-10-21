//# review 인터페이스 타입 정의

export default interface ReviewComponentPros {
    reviewRating: string;
    reviewDay: string;
    reviewContents: string;
    productName: string;
    reviewPhotoUrl: string;
    imageCount?: string;
}