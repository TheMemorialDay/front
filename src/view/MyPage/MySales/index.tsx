import React from 'react'
import './style.css';

export default function MySales() {
    return (
        <div id='mypage-sales-wrapper'>
            <div className='title'>매출 관리</div>
            <div className='line'></div>

            <div className='sales-graph-box'>월 매출 현황</div>

            <div className='sales-date-box'>
                <div className='selec-year-box'>
                    <div className='selec-year'>2024 ▼</div>
                    <div className='year-text'>년</div>
                </div>
                <div className='selec-month-box'>
                    <div className='selec-month'>10 ▼</div>
                    <div className='month-text'>월</div>
                </div>
            </div>

            <div className='completed-order-container'></div>
        </div>
    )
}
