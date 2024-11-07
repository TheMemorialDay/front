import OrderDetailsProps from "../../../types/order-details.interface";
import ResponseDto from "./response.dto";

export default interface GetOrderDetailListResponseDto extends ResponseDto {
  orders: OrderDetailsProps[];
}