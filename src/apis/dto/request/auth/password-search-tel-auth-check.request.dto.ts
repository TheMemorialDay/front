// interface: 비밀번호 찾기에서 전화번호 + 인증번호 확인 요청 dto //
export default interface PasswordResettingTelAuthCheckRequestDto {
	telNumber: string;
	telAuthNumber: string;
}