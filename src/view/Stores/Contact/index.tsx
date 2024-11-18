import React from 'react'
import { useNavigate, useOutletContext } from 'react-router';
import { ST_ABSOLUTE_CONTACT_DETAIL_PATH, ST_ABSOLUTE_INFORMATION_DETAIL_PATH, ST_ABSOLUTE_ORDER_DETAIL_PATH, ST_ABSOLUTE_REVIEW_DETAIL_PATH } from '../../../constants';
import './style.css';
import { GetStoreResponseDto } from '../../../apis/dto/response/stores';


export default function ShopContact() {

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
      <div className='menu-bar-contact'>
        <div className='shop-order' onClick={onOrderButtonClickHandler}>주문하기</div>
        <div className='shop-information' onClick={onInformationButtonClickHandler}>매장정보</div>
        <div className='shop-contact' onClick={onContactButtonClickHandler}>문의하기</div>
        <div className='shop-review' onClick={onReviewButtonClickHandler}>리뷰</div>
      </div>
      <div className='contact'>
        <p className='contact-intro'>
          고객님, 매장에 대한 문의가 있으신가요? 아래 내용을 참고하시고, 문의 사항을 남겨주시면 친절히 안내해드리겠습니다.
          <br /><br /><br />
          <strong>문의 전 안내</strong><br /><br />
          - 매장 운영 시간 내 문의를 주시면 더 빠르게 답변드릴 수 있습니다.<br />
          - 사장님들이 손님의 편의를 위해 항상 애쓰고 있으니 친절한 문의 부탁드립니다.<br /><br /><br />
          <strong>문의 방법</strong><br /><br />
          - 주문 번호, 특정 제품 정보 등을 포함해 주시면 더욱 빠른 안내가 가능합니다.<br />
          - 가게 별 연락 수단이 다르니, 하단의 연락 수단을 반드시 참고하시길 바랍니다.<br /><br />
          * 시스템에 관한 문의사항이 있다면 상단의 SUPPORT 카테고리를 참고해주시면 감사하겠습니다.
        </p><br />
          <strong><br />연락 수단</strong><br />
          <div className='contact-in'>
        {
          store?.storeContact?.split('\\n').map((line, index) => (
            <span className='contact-in' key={index}>{line}</span>
          ))
        }
        </div>
      </div>
    </div>
  );
}
