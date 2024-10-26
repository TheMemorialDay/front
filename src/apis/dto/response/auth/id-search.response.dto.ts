import ResponseDto from "../response.dto";

// interface: 아이디 찾기 응답 dto //
export default interface IdSearchResponseDto extends ResponseDto {
	name: string;
	telNumber: string;
	userId: string;
}