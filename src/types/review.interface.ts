//# review 인터페이스 타입 정의

export default interface ReviewComponentPros {
    reviewRating: number | string;
    reviewDay: string;
    reviewContents: string;
    productName: string;
    reviewPhotoUrl: string[];
    imageCount?: number;
}