// Notice Q&A 리스트 타입 정의

export default interface QaList {
    questionNumber: number;
    questionTitle: string;
    questionContents: string;
    questionDay: string;
    userId: string;
    questionStatus: string;
    answerContents: string;
}