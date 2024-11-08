import ResponseDto from "./response.dto";

export default interface GetOrderDetailResponseDto extends ResponseDto {
  orderCode: string;
  productNumber: number;
  storeNumber: number;
  userId: string;
  productContents: string | null;
  pickUpTime: string;
  orderStatus: string;
  productCount: number;
  totalPrice: number;
  orderTime: string;
  cancelCode: string | null;
  cancelReason: string | null;
  optionSelect: string;
  productImageUrl:string;
}