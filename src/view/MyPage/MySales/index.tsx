import React from 'react'
import './style.css';
import CompletedOrder from '../../../components/order_completed_box';
import YearSelect from '../../../components/year_select';
import MonthSelect from '../../../components/month_select';

// component: 매출관리 컴포넌트 //
export default function MySales() {

    // render: 매출관리 컴포넌트 렌더링 //
    return (
        <div id='mypage-sales-wrapper'>
            <div className='title'>매출 관리</div>
            <div className='line'></div>

            <div className='sales-graph-box'></div>

            <div className='sales-date-box'>
                <YearSelect />
                <MonthSelect />
            </div>

            <div className='completed-order-container'>
                <CompletedOrder />
                <CompletedOrder />
            </div>
        </div>
    )
}
