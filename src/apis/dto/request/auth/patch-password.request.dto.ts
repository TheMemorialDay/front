// interface: 비밀번호 재설정 요청 dto //
export default interface PatchPasswordRequestDto {
	userId: string;
	telNumber: string;
	telAuthNumber: string;
	password: string;
}