import React, { useState } from 'react'
import './style.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { MY_PRODUCT_ADD_ABSOLUTE_PATH, MY_PRODUCT_UPDATE_ABSOLUTE_PATH } from '../../../constants';

interface ShopComponentProps {
    imageUrl: string;
};

// component: 기존 상품 박스 컴포넌트 //
function Legacy({imageUrl} : ShopComponentProps) {

    // function: 네비게이터 //
    const navigator = useNavigate();

    // event handler: 엑스 버튼 클릭 이벤트 핸들러 //
    const onDeleteButtonClickHandler = () => {
        const isConfirm = window.confirm("정말 삭제하시겠습니까?");
        if(!isConfirm) return;
    }

    // event handler: 기존 상품 클릭 이벤트 핸들러 //
    const onClickLegacyClickHandler = () => {
        navigator(MY_PRODUCT_UPDATE_ABSOLUTE_PATH);
    }

    // render: 기존 상품 렌더링 //
    return (
        <div className='legacy-product' 
            onClick={onClickLegacyClickHandler}
            style={{backgroundImage: `url(${imageUrl})`}}>
            <div className="close-button" onClick={onDeleteButtonClickHandler}>X</div>
        </div>
    )
}

// component: 상품 관리 화면 컴포넌트 //
export default function MyProduct() {

    // event handler: 등록 버튼 클릭 이벤트 핸들러 //
    const onAddButtonClickHandler = () => {
        navigator(MY_PRODUCT_ADD_ABSOLUTE_PATH);
    }

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // render: 상품 관리 화면 렌더링 //
    return (
        <div id='manage-product'>
            <div className='title'>상품 관리</div>
            <hr className='custom-hr'/>
            <div id='center'>
                <div className='product-box'>
                    <div className='add-button' onClick={onAddButtonClickHandler}>
                        <div className='circle'>+</div>
                        <div className='add-text'>상품 추가</div>
                    </div>
                    <Legacy imageUrl='/picture1.png'/>
                    <Legacy imageUrl='/picture12.png'/>
                    <Legacy imageUrl='/picture13.png'/>
                </div>
            </div>
        </div>
        
    )
}