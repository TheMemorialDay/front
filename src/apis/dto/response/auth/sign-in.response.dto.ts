import ResponseDto from "../response.dto";

// interface: 로그인 시 응답 dto //
export default interface SignInResponseDto extends ResponseDto {
	accessToken: string;
	expiration: number;
}