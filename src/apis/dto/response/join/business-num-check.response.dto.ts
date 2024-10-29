import DataForm from "./data-form";

export default interface BusinessNumCheckResponseDto {
    request_cnt: number;
    match_cnt: number;
    status_code: string;
    data: DataForm[];
}