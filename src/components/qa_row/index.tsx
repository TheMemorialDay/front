import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SU_QA_DETAIL_PATH } from '../../constants';
import { QaList } from '../../types';
import formatDate from '../dateChange/DateChange';
import maskString from '../maskingString/MaskingString';

interface QnAProps {
    qna: QaList;
    getQnAList: () => void;
    onDetailClickHandler: (noticeNumber: number) => void;
}

// component: QARow 컴포넌트 //
export default function QaRow({qna, getQnAList, onDetailClickHandler}: QnAProps) {
    
    // state: 해당 게시글 답변 상태 //
    const [anwserState, setAnwserState] = useState<'대기' | '완료'>('대기');
    // state: 답변 여부 상태 //
    const [hasAnswer, setHasAnswer] = useState<QaList | null>(null);

    // effect: 답변 여부에 따른 답변 상태 변경 //
    useEffect(() => {
        if (!hasAnswer) setAnwserState('대기');
        setAnwserState('완료');
    }, [hasAnswer]);

    // render: QARow 컴포넌트 렌더링 //
    return (
        <>
            <div className="tr" onClick={() => onDetailClickHandler(qna.questionNumber)}>
                <div className="td-no">{qna.questionNumber}</div>
                <div className="td-title">{qna.questionTitle}</div>
                <div className="td-writer">{maskString(qna.userId)}</div>
                <div className="td-date">{formatDate(qna.questionDay)}</div>
                <div className="td-status">{qna.questionStatus === '미응답' ? '대기' : '완료'}</div>
            </div>
            
        </>
    )

}
