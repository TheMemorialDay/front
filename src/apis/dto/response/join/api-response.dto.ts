import DataDto from "./data-dto";

export default interface ApiResponseDto {
    status_code: string;
    request_cnt: number;
    valid_cnt: number;
    data: DataDto[];
}