// interface: 회원가입 dto //
export default interface SignUpRequestDto {
	userId: string;
	password: string;
	name: string;
	birth: string;
	gender: string;
	telNumber: string;
	telAuthNumber: string;
	joinPath: string;
	snsId: string | null;
}