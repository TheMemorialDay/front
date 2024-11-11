// interface: 비밀번호 재설정을 위한 최종 통합 확인 요청 dto //
export default interface PasswordResettingFinalRequestDto {
	userId: string;
	telNumber: string;
	telAuthNumber: string;
}