import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SU_QA_DETAIL_PATH } from '../../constants';
import { QaList } from '../../types';

// component: QARow 컴포넌트 //
export default function QaRow() {
    
    // state: 해당 게시글 답변 상태 //
    const [anwserState, setAnwserState] = useState<'대기' | '완료'>('대기');
    // state: 답변 여부 상태 //
    const [hasAnswer, setHasAnswer] = useState<QaList | null>(null);

    // effect: 답변 여부에 따른 답변 상태 변경 //
    useEffect(() => {
        if (!hasAnswer) setAnwserState('대기');
        setAnwserState('완료');
    }, [hasAnswer]);

    // function: 네비게이터 //
    const navigator = useNavigate();

    // event handler: 로우 클릭 시 디테일 페이지로 이동 //
    //* 나중에 해당 번호 가져오기
    const onDetailButtonHandler = () => {
        navigator(SU_QA_DETAIL_PATH);
    };

    // render: QARow 컴포넌트 렌더링 //
    return (
        <>
            <div className="tr" onClick={onDetailButtonHandler}>
                <div className="td-no">10</div>
                <div className="td-title">케이크가 주문대로 제작되지 않았습니다.</div>
                <div className="td-writer">홍*동</div>
                <div className="td-date">2024-10-04</div>
                <div className="td-status">{hasAnswer ? '대기' : '완료'}</div>
            </div>
            {/* 확인용 */}
            <div className="tr">
                <div className="td-no">10</div>
                <div className="td-title">사장님이 주문 수락을 해주지 않아요.</div>
                <div className="td-writer">남*현</div>
                <div className="td-date">2024-10-04</div>
                <div className="td-status">완료</div>
            </div>
        </>
    )

}
