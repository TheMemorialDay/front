import React from 'react'
import './style.css';

// component: 매출관리 컴포넌트 //
export default function MySales() {

    // render: 매출관리 컴포넌트 렌더링 //
    return (
        <div id='mypage-sales-wrapper'>
            <div className='title'>매출 관리</div>
            <div className='line'></div>

            <div className='sales-graph-box'>월 매출 현황</div>

            {/* 셀렉터 */}
            <div className='sales-date-box'>

                {/* 년 선택 */}
                <div className='year-select-box'>
                    {/* <div className='year-input-box close'>
                        <div className='selected-item'>년도 선택</div>
                        <div className='arrow-down-button'></div>
                    </div> */}

                    <div className='year-input-box open'>
                        <div className='selected-item'>년도 선택</div>
                        <div className='arrow-up-button'></div>
                        <div className='selector-box'>
                            <div className='selector-option'>2024</div>
                            <div className='selector-option'>2025</div>
                            <div className='selector-option'>2026</div>
                            <div className='selector-option'>2027</div>
                        </div>
                    </div>
                    <div className='year-text'>년</div>
                </div>

                {/* 월 선택 */}
                <div className='month-select-box'></div>

            </div>
            {/* 셀렉터 */}

            <div className='completed-order-container'>
                <div className='completed-box'>
                    <div className='top'>
                        <div className='order-status'>픽업 완료</div>
                        <div className='order-code'>주문 코드 2024101088888</div>
                    </div>

                    <div className='main'>
                        <div className='image'></div>
                        <div className='order-info'>
                            <div className='pick-up-date'>픽업 일시 2024.10.10</div>
                            <div className='product-name'>상품 부드러운 생크림 케이크</div>
                            <div className='option-info'>옵션 1호, 바닐라, 요청사항: 없음</div>
                            <div className='customer-info'>고객 정보 홍길동 / 010-5555-6666</div>
                        </div>
                        <div className='order-price'>금액 33,000</div>
                    </div>
                </div>

                {/* UI 확인용 복붙 */}
                <div className='completed-box'>
                    <div className='top'>
                        <div className='order-status'>픽업 완료</div>
                        <div className='order-code'>주문 코드 2024101088888</div>
                    </div>

                    <div className='main'>
                        <div className='image'></div>
                        <div className='order-info'>
                            <div className='pick-up-date'>픽업 일시 2024.10.10</div>
                            <div className='product-name'>상품 부드러운 생크림 케이크</div>
                            <div className='option-info'>옵션 1호, 바닐라, 요청사항: 없음</div>
                            <div className='customer-info'>고객 정보 홍길동 / 010-5555-6666</div>
                        </div>
                        <div className='order-price'>금액 33,000</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
