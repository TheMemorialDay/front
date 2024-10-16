import React from 'react'
import { useNavigate } from 'react-router';
import { ST_ABSOLUTE_CONTACT_DETAIL_PATH, ST_ABSOLUTE_INFORMATION_DETAIL_PATH, ST_ABSOLUTE_ORDER_DETAIL_PATH, ST_ABSOLUTE_REVIEW_DETAIL_PATH } from '../../../constants';
import './style.css';
import ShopMain from '../../../components/Shopinformation';

export default function ShopContact() {

  const navigator = useNavigate();

  const onOrderButtonClickHandler = () => {
    navigator(ST_ABSOLUTE_ORDER_DETAIL_PATH);
  };

  const onInformationButtonClickHandler = () => {
    navigator(ST_ABSOLUTE_INFORMATION_DETAIL_PATH);
  };

  const onContactButtonClickHandler = () => {
    navigator(ST_ABSOLUTE_CONTACT_DETAIL_PATH);
  };

  const onReviewButtonClickHandler = () => {
    navigator(ST_ABSOLUTE_REVIEW_DETAIL_PATH);
  };

  return (
    <div id='store-detail-wrapper'>
      <ShopMain />
      <div className='menu-bar-contact'>
        <div className='shop-order' onClick={onOrderButtonClickHandler}>주문하기</div>
        <div className='shop-information' onClick={onInformationButtonClickHandler}>매장정보</div>
        <div className='shop-contact' onClick={onContactButtonClickHandler}>문의하기</div>
        <div className='shop-review' onClick={onReviewButtonClickHandler}>리뷰</div>
      </div>
      <div className='contact'>
        <h2>인스타그램  @abc_cake53 </h2>
        <h2>오픈채팅  https://open.kakao.com/o/s6738n2f</h2>
        <h2>* 마이페이지 – 가게 관리, 문의하기에서 적은 글</h2>
      </div>
    </div>
  )
}
