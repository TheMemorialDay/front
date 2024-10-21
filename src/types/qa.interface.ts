//# Notice Q&A 리스트 타입 정의

export default interface QaList {
    questionNumber: number;
    questionTitle: string;
    questionContents: string;
    questionDay: string;
    name: string;
    questionStatus: '대기' | '완료';
    answerContents: string;
}