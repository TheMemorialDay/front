import { NewOrderDetailsProps } from "../../../types";
import ResponseDto from "./response.dto";

export default interface NewGetOrderManageList extends ResponseDto {
    orderManages: NewOrderDetailsProps[];
}