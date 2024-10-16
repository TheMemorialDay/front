import { useNavigate } from 'react-router';
import './style.css';
import React, { useState } from 'react'
import { ST_ABSOLUTE_CONTACT_DETAIL_PATH, ST_ABSOLUTE_INFORMATION_DETAIL_PATH, ST_ABSOLUTE_ORDER_DETAIL_PATH, ST_ABSOLUTE_REVIEW_DETAIL_PATH } from '../../../constants';
import ShopMain from '../../../components/Shopinformation';

export default function ShopOrder() {

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


  interface ShopComponentProps {
    imageUrl: string;
    title: string;
    price: string;
    hashtags: string;
  };

  function ShopComponent({ imageUrl, title, price, hashtags }: ShopComponentProps) {

    const [hover, setHover] = useState(false);
    return (
      <div className="cake-item" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ backgroundImage: `url(${imageUrl})` }}>
        {hover && (
          <div className="cake-overlay">
            <h2>{title}</h2>
            <p className='hashtags'>{hashtags}</p>
            <p className='price'>{price}원</p>
          </div>
        )}
      </div>
    );
  };


  return (
    <div id='store-detail-wrapper'>
      <ShopMain />
      <div className='menu-bar-order'>
        <div className='shop-order' onClick={onOrderButtonClickHandler}>주문하기</div>
        <div className='shop-information' onClick={onInformationButtonClickHandler}>매장정보</div>
        <div className='shop-contact' onClick={onContactButtonClickHandler}>문의하기</div>
        <div className='shop-review' onClick={onReviewButtonClickHandler}>리뷰</div>
      </div>
      <div className='product'>
        <ShopComponent imageUrl="/picture1.png" title="케이크1" price="35000" hashtags='#깔끔함 #달달함 #꽃케잌' />
        <ShopComponent imageUrl="/picture12.png" title="케이크2" price="45000" hashtags='#깔끔함 #청량함' />
        <ShopComponent imageUrl="/picture13.png" title="케이크3" price="32000" hashtags='#귀여움 #핑크' />
        <ShopComponent imageUrl="/picture14.png" title="케이크4" price="30000" hashtags='#로또당첨' />
      </div>
    </div>
  )
}
