import React from 'react'
import './style.css';
import CartBox from '../../components/shopping_cart';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, ST_ABSOLUTE_ORDER_DETAIL_PATH } from '../../constants';
import { useCookies } from 'react-cookie';

// component: 장바구니 컴포넌트 //
export default function ShoppingCart() {

    // state: cookie 상태 //
    const [ cookies ] = useCookies();

    // function: 네비게이터 //
    const navigator = useNavigate();

    // event handler: 삭제 버튼 //
    const onDeleteButtonHandler = () => {
        const isConfirm = window.confirm('정말로 삭제하시겠습니까?')
        if (!isConfirm) return;
    };

    // event handler: 주문 요청 버튼 //
    const onOrderRequestButtonHandler = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        const isConfirm = window.confirm('주문하시겠습니까?');
        if (!isConfirm) return;
        // 네비게이터 주문 요청 완료 페이지 이동
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
                    <div className='item-box'>
                        <input type="checkbox" id="check1" />
                        <label htmlFor="check1"></label>
                        <CartBox />
                        <div className='button delete-button' onClick={onDeleteButtonHandler}>삭제</div>
                    </div>
                    
                    <div className='item-box'>
                        <input type="checkbox" id="check2" />
                        <label htmlFor="check2"></label>
                        <CartBox />
                        <div className='button delete-button' onClick={onDeleteButtonHandler}>삭제</div>
                    </div>
                </div>
            </div>

            <div className='bottom'>
                <div className='total-count'>총 금액 33,000</div>
                <div className='button order-request-button' onClick={onOrderRequestButtonHandler}>주문</div>
            </div>
        </div>
    )
}
