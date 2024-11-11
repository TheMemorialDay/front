// get-keyword-list.response.dto.ts
export interface KeywordData {
    keyword: string;
    frequency: number;
}

export interface GetKeywordListResponseDto {
    keywords: KeywordData[];
}
