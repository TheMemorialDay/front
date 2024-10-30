import React from 'react'
import { useNavigate, useOutletContext } from 'react-router';
import { ST_ABSOLUTE_CONTACT_DETAIL_PATH, ST_ABSOLUTE_INFORMATION_DETAIL_PATH, ST_ABSOLUTE_ORDER_DETAIL_PATH, ST_ABSOLUTE_REVIEW_DETAIL_PATH } from '../../../constants';
import './style.css';
import ShopMain from '../../../components/Shopinformation';
import ReviewComponent from '../../../components/review';
import { GetStoreResponseDto } from '../../../apis/dto/response/stores';


export default function ShopReview() {

  const navigator = useNavigate();

  const { store } = useOutletContext<{ store: GetStoreResponseDto | null }>();

  const onOrderButtonClickHandler = () => {
    if (store)
      navigator(ST_ABSOLUTE_ORDER_DETAIL_PATH(store.storeNumber));
  };

  const onInformationButtonClickHandler = () => {
    if (store)
      navigator(ST_ABSOLUTE_INFORMATION_DETAIL_PATH(store.storeNumber));
  };

  const onContactButtonClickHandler = () => {
    if (store)
      navigator(ST_ABSOLUTE_CONTACT_DETAIL_PATH(store.storeNumber));
  };

  const onReviewButtonClickHandler = () => {
    if (store)
      navigator(ST_ABSOLUTE_REVIEW_DETAIL_PATH(store.storeNumber));
  };

  return (
    <div id='store-detail-wrapper'>
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
            <ReviewComponent reviewRating="5.0"
              reviewDay="2024 01 01"
              reviewContents="모양도 예쁘고 맛도 있었어요!"
              productName="딸기케이크"
              reviewPhotoUrl="/picture1.png"
              imageCount="3" />
            <ReviewComponent reviewRating="4.0"
              reviewDay="2024 01 03"
              reviewContents="저희 딸이 먹어보더니 너무 맛있다고 하네요 ~ 재방문 의사 있어요."
              productName="초코케이크"
              reviewPhotoUrl="/picture12.png" />
            <ReviewComponent reviewRating="1.0"
              reviewDay="2024 02 01"
              reviewContents="너무 달아서 별로에요. 멜론도 고작 2조각 들어있어요"
              productName="멜론케이크"
              reviewPhotoUrl="/picture13.png"
              imageCount="2" />
            <ReviewComponent reviewRating="5.0"
              reviewDay="2024 02 03"
              reviewContents="색감이 여긴 완전 예술.."
              productName="포토케이크"
              reviewPhotoUrl="/picture14.png"
            />
          </div>
          <div className='filter-right'></div>
        </div>
      </div>
    </div>
  )
}
