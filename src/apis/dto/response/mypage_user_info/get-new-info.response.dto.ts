import ResponseDto from "../response.dto";

// interface: 개인 정보 수정을 위한 정보들 불러오는 get user infos response body dto //
export default interface GetNewInfo extends ResponseDto {
	name: string;
	birth: string;
	gender: string;
	telNumber: string;
}