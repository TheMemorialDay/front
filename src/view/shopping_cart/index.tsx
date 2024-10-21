import React from 'react'
import './style.css';
import CartBox from '../../components/shopping_cart';
import { useNavigate } from 'react-router-dom';
import { ST_ABSOLUTE_ORDER_DETAIL_PATH } from '../../constants';

// component: 장바구니 컴포넌트 //
export default function ShoppingCart() {

    // function: 네비게이터 //
    const navigator = useNavigate();

    // event handler: 삭제 버튼 //
    const onDeleteButtonHandler = () => {
        const isConfirm = window.confirm('정말로 삭제하시겠습니까?')
        if (!isConfirm) return;
    };

    // event handler: 상자 클릭 시 해당 가게 상세 페이지로 이동 //
    const onItemDetailClickHandler = (path: string) => {
        navigator(path);
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
                    <div className='item-box' onClick={() => onItemDetailClickHandler(ST_ABSOLUTE_ORDER_DETAIL_PATH)}>
                        <input type="checkbox" id="check1" />
                        <label htmlFor="check1"></label>
                        <CartBox />
                        <div className='button delete-button' onClick={onDeleteButtonHandler}>삭제</div>
                    </div>
                    
                    <div className='item-box' onClick={() => onItemDetailClickHandler(ST_ABSOLUTE_ORDER_DETAIL_PATH)}>
                        <input type="checkbox" id="check2" />
                        <label htmlFor="check2"></label>
                        <CartBox />
                        <div className='button delete-button' onClick={onDeleteButtonHandler}>삭제</div>
                    </div>
                </div>
            </div>

            <div className='bottom'>
                <div className='total-count'>총 금액 33,000</div>
            </div>
        </div>
    )
}
