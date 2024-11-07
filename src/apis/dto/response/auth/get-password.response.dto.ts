import ResponseDto from "../response.dto";

// interface: 비밀번호 재설정 시 비교를 위해 비밀번호만 응답 받는 dto //
export default interface GetOnlyPasswordResponseDto extends ResponseDto {
	password: string;
}