import React from 'react'
import './style.css';

// component: 장바구니 컴포넌트 //
export default function ShoppingCart() {

    // event handler: 삭제 버튼 //
    const onDeleteButtonHandler = () => {
        const isConfirm = window.confirm('정말로 삭제하시겠습니까?')
        if (!isConfirm) return;
    };

    // render: 장바구니 컴포넌트 렌더링 //
    return (
        <div id='shopping-cart-wrapper'>
            <div className='top'>장바구니</div>

            <div className='main'>
                <div className='main-option'>
                    <div className='option option-choice'>선택</div>
                    <div className='option option-update'>수정</div>
                </div>

                <div className='main-box'>
                    <input type="checkbox" id="check1" />
                    <label htmlFor="check1"></label>

                    <div className='cart-box'>
                        <div className='image'></div>
                        <div className='cart-info'>
                            <div className='product-name'>부산 케이크</div>
                            <div className='product-info'>
                                <div>부드러운 초코 케이크</div>
                                <div>옵션 1호, 초코, 요청사항 없음, 1개</div>
                                <div>픽업 일시 2024.11.01</div>
                            </div>
                        </div>
                        <div className='total-count'>금액 33,000</div>
                    </div>

                    <div className='button delete-button' onClick={onDeleteButtonHandler}>삭제</div>
                </div>

                {/* UI를 위해 잠깐만 복사 */}
                <div className='main-box'>
                    <input type="checkbox" id="check1" />
                    <label htmlFor="check1"></label>

                    <div className='cart-box'>
                        <div className='image'></div>
                        <div className='cart-info'>
                            <div className='product-name'>부산 케이크</div>
                            <div className='product-info'>
                                <div>부드러운 초코 케이크</div>
                                <div>옵션 1호, 초코, 요청사항 없음, 1개</div>
                                <div>픽업 일시 2024.11.01</div>
                            </div>
                        </div>
                        <div className='total-count'>금액 33,000</div>
                    </div>

                    <div className='button delete-button'>삭제</div>
                </div>
            </div>

            <div className='bottom'>
                <div className='total-count'>총 금액 33,000</div>
            </div>
        </div>
    )
}
