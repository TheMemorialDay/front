import React, { useState } from 'react'
import SupportNavi from '../../../components/support_navi'
import './style.css';
import { useNavigate } from 'react-router-dom';
import { SU_ABSOLUTE_QA_PATH } from '../../../constants';
import { QaList } from '../../../types';

// component: Q&A Detail 컴포넌트 //
export default function QaDetail() {

    // state: 답변 여부 상태 //
    const [hasAnswer, setHasAnswer] = useState<QaList | null>(null);

    // function: 네비게이터 //
    const navigator = useNavigate();

    // event handler: 삭제 버튼 //
    const onDeleteButtonHandler = () => {
        const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
        if (!isConfirm) return;
        
        navigator(SU_ABSOLUTE_QA_PATH);
    };

    // render: Q&A Detail 컴포넌트 렌더링 //
    return (
        <div id='qa-detail-wrapper'>
            <SupportNavi />
            <div className='write-info-box'>
                <div className='writer-box'>
                    <div className='writer-title'>작성자</div>
                    <div className='writer'>qwer1234</div>
                </div>
                <div className='write-date-box'>
                    <div className='write-date-title'>작성일</div>
                    <div className='write-date'>2024.10.01</div>
                </div>
            </div>

            <div className='subject-box'>
                <div className='subject-title'>제목</div>
                <div className='subject-text'>케이크가 상한 것 같아요.</div>
            </div>

            <div className='script-box'>
                <div className='script-title'>내용</div>
                <div className='script-text'>케이크가 상한 것 같은데 가게에 전화를 해도 전화를 안 받네요. <br /> 어떻게 하면 좋을까요?</div>
            </div>

            <div className='line'></div>

            {hasAnswer &&
                <div className='answer-box'>
                    <div className='answer-title'>답변</div>
                    <div className='answer-text'>저희가 가게에 직접 확인해보겠습니다. 조금만 기다려 주세요.</div>
                </div>
            }

            <div className='button-box'>
                <div className='button delete-button' onClick={onDeleteButtonHandler}>삭제</div>
            </div>
        </div>
    )
}
