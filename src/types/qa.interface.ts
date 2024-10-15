// Notice Q&A 리스트 타입 정의

export default interface QaList {
    qaNumber: number;
    qaTitle: string;
    qaWriter: string;
    qaDate: string;
    qaStatus: '대기' | '완료';
}