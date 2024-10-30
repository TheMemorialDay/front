import { NoticeList, QaList } from "../../../../types";
import ResponseDto from "../response.dto";

// interface: get notice list response body dto //
export default interface GetQnAListResponseDto extends ResponseDto{
    qnas: QaList[];
}