// interface: 전화번호 + 인증번호 확인 dto //
export default interface TelAuthCheckRequestDto {
	telNumber: string;
	telAuthNumber: string;
}