import React from 'react'
import { useNavigate } from 'react-router';
import { ST_ABSOLUTE_CONTACT_DETAIL_PATH, ST_ABSOLUTE_INFORMATION_DETAIL_PATH, ST_ABSOLUTE_ORDER_DETAIL_PATH, ST_ABSOLUTE_REVIEW_DETAIL_PATH } from '../../../constants';
import './style.css';
import ShopMain from '../../../components/Shopinformation';


export default function ShopReview() {

  interface ReviewComponentPros {
    rating: string;
    date: string;
    review: string;
    product: string;
    image: string;
    imageCount?: string;
  }

  function ReviewComponent({ rating, date, review, product, image, imageCount }: ReviewComponentPros) {
    return (
      <div className="review-card">
        <div className="review-rating">
          <span className="star">⭐</span>
          <span className="rating-value">{rating}</span>
        </div>
        <div className="review-details">
          <p className="review-date">{date}</p>
          <p className="review-text">{review}</p>
          <p className="review-product">상품 - {product}</p>
        </div>
        <div className="review-image">
          <div className='review-image-list' style={{ backgroundImage: `url(${image})` }}></div>
          {imageCount &&
            <div className="image-count">{imageCount}</div>
          }
        </div>
      </div>
    );
  };

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
      <div className='menu-bar-review'>
        <div className='shop-order' onClick={onOrderButtonClickHandler}>주문하기</div>
        <div className='shop-information' onClick={onInformationButtonClickHandler}>매장정보</div>
        <div className='shop-contact' onClick={onContactButtonClickHandler}>문의하기</div>
        <div className='shop-review' onClick={onReviewButtonClickHandler}>리뷰</div>
      </div>
      <div className='shop-review-bottom'>
        <div className='review-total'>전체 12건</div>
        <div className='shop-review-bottom-list'>
          <div className='filter-left'></div>
          <div className='shop-review-list'>
            <ReviewComponent rating="5.0"
              date="2024 01 01"
              review="모양도 예쁘고 맛도 있었어요!"
              product="딸기케이크"
              image="/picture1.png"
              imageCount="3" />
            <ReviewComponent rating="4.0"
              date="2024 01 03"
              review="저희 딸이 먹어보더니 너무 맛있다고 하네요 ~ 재방문 의사 있어요."
              product="초코케이크"
              image="/picture12.png" />
            <ReviewComponent rating="1.0"
              date="2024 02 01"
              review="너무 달아서 별로에요. 멜론도 고작 2조각 들어있어요"
              product="멜론케이크"
              image="/picture13.png"
              imageCount="2" />
            <ReviewComponent rating="5.0"
              date="2024 02 03"
              review="색감이 여긴 완전 예술.."
              product="포토케이크"
              image="/picture14.png"
            />
          </div>
          <div className='filter-right'></div>
        </div>
      </div>
    </div>
  )
}
