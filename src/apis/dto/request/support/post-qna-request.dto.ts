// interface: post QnA request body dto //
export default interface PostQnARequestDto {
    questionTitle: string;
    questionContents: string;
    questionDay: string;
    userId: string;
    questionStatus: string;
    answerContents: string;
}