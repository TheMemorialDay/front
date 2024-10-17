import React from 'react'
import { useNavigate } from 'react-router';
import { ST_ABSOLUTE_CONTACT_DETAIL_PATH, ST_ABSOLUTE_INFORMATION_DETAIL_PATH, ST_ABSOLUTE_ORDER_DETAIL_PATH, ST_ABSOLUTE_REVIEW_DETAIL_PATH } from '../../../constants';
import './style.css';
import ShopMain from '../../../components/Shopinformation';
import MapContainer from '../../../components/Map/map';


export default function ShopInformation() {

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
      <div className='menu-bar-information'>
        <div className='shop-order' onClick={onOrderButtonClickHandler}>주문하기</div>
        <div className='shop-information' onClick={onInformationButtonClickHandler}>매장정보</div>
        <div className='shop-contact' onClick={onContactButtonClickHandler}>문의하기</div>
        <div className='shop-review' onClick={onReviewButtonClickHandler}>리뷰</div>
      </div>
      <div className='information'>
        <MapContainer />
        <div className='line'></div>
        <div className='shop-locate'>위치설명</div>
      </div>
    </div>
  )
}
