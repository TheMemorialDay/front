// interface: get-product-response.dto //

import { PostProductOptionRequestDto } from "../../request/product";
import ResponseDto from "../response.dto";

export default interface GetProductResponseDto extends ResponseDto {
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
