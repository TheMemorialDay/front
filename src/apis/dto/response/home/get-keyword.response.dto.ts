import { KeywordComponentProps } from "../../../../types";
import ResponseDto from "../response.dto";

// interface: 인기 키워드를 가져오기 위한 응답 dto //
export default interface GetKeywordResponseDto extends ResponseDto {
	keywords: KeywordComponentProps[];
};