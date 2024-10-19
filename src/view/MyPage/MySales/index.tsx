import React from 'react'
import './style.css';

export default function MySales() {
    return (
        <div id='mypage-sales-wrapper'>
            <div className='title'>매출 관리</div>
            <div className='line'></div>

            <div className='sales-graph-box'></div>

            <div className='sales-date-box'></div>

            <div className='completed-order-container'></div>
        </div>
    )
}
