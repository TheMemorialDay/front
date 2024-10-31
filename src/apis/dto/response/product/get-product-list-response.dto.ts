// src/apis/dto/response/product/get-product-list-response.dto.ts

import {Product} from "../../../../types"; // Product 인터페이스 import
import ResponseDto from "../response.dto";

export interface ProductResponse {
    productNumber: number;
    imageUrl: string;
    productName: string;
    productIntroduce: string;
    productPrice: number;
}

export default interface GetProductListResponseDto extends ResponseDto {
    products: ProductResponse[];
}
