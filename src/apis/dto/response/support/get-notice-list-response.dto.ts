import { NoticeList } from "../../../../types";
import ResponseDto from "../response.dto";

// interface: get notice list response body dto //
export default interface GetNoticeListResponseDto extends ResponseDto{
    notices: NoticeList[];
}