//# Notice Q&A 리스트 타입 정의

export default interface QaList {
    qaNumber: number;
    qaTitle: string;
    qaScript: string;
    qaDate: string;
    qaWriter: string;
    qaStatus: '대기' | '완료';
    qaAnswer: string;
}