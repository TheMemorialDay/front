import ResponseDto from "../response.dto";

// interface: get notice detail response body dto //
export default interface GetNoticeDetailResponseDto extends ResponseDto{
    noticeTitle: string;
    noticeDay: string;
    noticeContents: string;
}