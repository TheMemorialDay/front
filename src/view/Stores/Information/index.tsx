import React from 'react'
import { useNavigate, useOutletContext } from 'react-router';
import { ST_ABSOLUTE_CONTACT_DETAIL_PATH, ST_ABSOLUTE_INFORMATION_DETAIL_PATH, ST_ABSOLUTE_ORDER_DETAIL_PATH, ST_ABSOLUTE_REVIEW_DETAIL_PATH } from '../../../constants';
import './style.css';
import ShopMain from '../../../components/Shopinformation';
import MapContainer from '../../../components/Map/map';
import { StoreComponentProps } from '../../../types';
import { GetStoreResponseDto } from '../../../apis/dto/response/stores';


export default function ShopInformation() {

  const { store } = useOutletContext<{ store: GetStoreResponseDto | null }>();

  const navigator = useNavigate();

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
      <div className='menu-bar-information'>
        <div className='shop-order' onClick={onOrderButtonClickHandler}>주문하기</div>
        <div className='shop-information' onClick={onInformationButtonClickHandler}>매장정보</div>
        <div className='shop-contact' onClick={onContactButtonClickHandler}>문의하기</div>
        <div className='shop-review' onClick={onReviewButtonClickHandler}>리뷰</div>
      </div>
      <div className='information'>
        <div className='shop-locate'>
          {
            store?.storeParticular?.split('\\n').map((line, index) => (
              <div className='shop-locate-in' key={index}>{line}</div>
            ))
          }
        </div>
          {/* <div className='line'></div> */}
        <div>
        {
          store ? <MapContainer storeLatitude={store.storeLatitude} storeLongtitude={store.storeLongtitude} /> : ''
        }
        </div>


      </div>
    </div>
  )
}
