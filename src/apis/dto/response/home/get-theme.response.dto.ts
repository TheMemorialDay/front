import { ThemeComponentProps } from "../../../../types";
import ResponseDto from "../response.dto";

// interface: 인기 테마 불러오기를 위한 응답 dto //
export default interface GetHotThemeResponseDto extends ResponseDto {
	themas: ThemeComponentProps[];
};