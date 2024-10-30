import ResponseDto from "../response.dto";

// interface: get notice detail response body dto //
export default interface GetQnADetailResponseDto extends ResponseDto{
    questionTitle: string;
    questionDay: string;
    questionContents: string;
    userId: string;
    questionStatus: string;
    answerContents :string | undefined;
    name: string;
}