import { PostProductOptionRequestDto } from "../apis/dto/request/product";

export default interface Product {
    productNumber: number;
    productImageUrl: string;
    productImages: string[];
    productName: string;
    productIntroduce: string;
    productPrice: number;
    productToday: boolean;
    productTag: string;
    options: PostProductOptionRequestDto[];
    themes: string[];
}
