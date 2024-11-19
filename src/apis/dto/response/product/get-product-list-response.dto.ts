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
