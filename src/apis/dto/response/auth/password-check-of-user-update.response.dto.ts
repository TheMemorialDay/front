import ResponseDto from "../response.dto";

// interface: 개인 정보 수정을 위한 유저 인증 토큰 생성 응답 dto //
export default interface PasswordCheckOfUserUpdateResponseDto extends ResponseDto {
	accessToken: string;
	expiration: number;
}