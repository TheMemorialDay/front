import ResponseDto from "../response.dto";
import PreviewProduct from "./preview-product-list";

export default interface GetProductPreviewListResponseDto extends ResponseDto {
    previewProducts: PreviewProduct[];
}