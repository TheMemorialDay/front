import BusinessCheckDataForm from "../../request/join/business-check-dataFrom.request.dto";
import DataForm from "./data-form";

export default interface DataDto{
    b_no: string;
    valid: string;
    valid_msg: string;
    request_param: BusinessCheckDataForm;
    status: DataForm;
}