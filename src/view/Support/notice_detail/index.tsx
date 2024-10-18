import React from 'react'
import './style.css';

// component: NoticeDetail 컴포넌트 //
export default function NoticeDetail() {

    // render: NoticeDetail 컴포넌트 렌더링 //
    return (
        <div id='notice-detail-wrapper'>
            <div className='title'>SUPPORT</div>
            <div className='top'>
                <div className='detail-title'>
                    <div className='detail-title-main'>제목</div>
                    <div className='detail-title-content'>제 2차 정기 점검</div>
                </div>
                <div className='detail-date'>
                    <div className='detail-date-main'>작성일</div>
                    <div className='detail-date-content'>2024-10-01</div>
                </div>
            </div>
            <div className='main'>
                <div className='main-content'>제 2차 정기 점검으로 인해 불편을 끼쳐드려 죄송합니다.</div>
            </div>
        </div>
    )
}
