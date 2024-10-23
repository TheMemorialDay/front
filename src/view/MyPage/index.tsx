import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { MY_INFO_PATH, MY_REVIEW_PATH, MY_ORDER_DETAIL_PATH, MY_LIKE_PATH, MY_STORE_PATH, MY_PRODUCT_PATH, MY_ORDER_MANAGE_PATH, MY_SALES_PATH, MY_PASSWORD_CHECK_ABSOLUTE_PATH, MY_PASSWORD_CHECK_PATH } from '../../constants';

const MyPage = () => {
    const navigate = useNavigate();

    const onClickNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div id='myPage'>
            <span className='myPage-title'>MY PAGE</span>
            <div id='general'>
                <div className='userInfo' onClick={() => onClickNavigation(`${MY_INFO_PATH}/${MY_PASSWORD_CHECK_PATH}`)}>
                    <div className='category-icon userInfo'></div>
                    <div className='category-title'>개인정보 관리</div>
                </div>
                <div className='review' onClick={() => onClickNavigation(MY_REVIEW_PATH)}>
                    <div className='category-icon review'></div>
                    <div className='category-title'>리뷰 관리</div>
                </div>
                <div className='order-detail' onClick={() => onClickNavigation(MY_ORDER_DETAIL_PATH)}>
                    <div className='category-icon order-detail'></div>
                    <div className='category-title'>주문 내역</div>
                </div>
                <div className='like' onClick={() => onClickNavigation(MY_LIKE_PATH)}>
                    <div className='category-icon like'></div>
                    <div className='category-title'>찜한 가게</div>
                </div>
            </div>
            <div id='ceo'>
                <div className='store' onClick={() => onClickNavigation(MY_STORE_PATH)}>
                    <div className='category-icon store'></div>
                    <div className='category-title'>가게 관리</div>
                </div>
                <div className='product' onClick={() => onClickNavigation(MY_PRODUCT_PATH)}>
                    <div className='category-icon product'></div>
                    <div className='category-title'>상품 관리</div>
                </div>
                <div className='order-manage' onClick={() => onClickNavigation(MY_ORDER_MANAGE_PATH)}>
                    <div className='category-icon order-manage'></div>
                    <div className='category-title'>주문 관리</div>
                </div>
                <div className='sales' onClick={() => onClickNavigation(MY_SALES_PATH)}>
                    <div className='category-icon sales'></div>
                    <div className='category-title'>매출 관리</div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
