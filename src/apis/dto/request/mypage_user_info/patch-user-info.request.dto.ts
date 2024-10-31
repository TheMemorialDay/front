// interface: 회원 수정을 위한 요청 dto //
export default interface PatchUserInfoRequestDto {
	name: string;
	birth: string;
	gender: string;
	telNumber: string;
}