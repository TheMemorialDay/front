import React, { useEffect, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router';
import { ST_ABSOLUTE_CONTACT_DETAIL_PATH, ST_ABSOLUTE_INFORMATION_DETAIL_PATH, ST_ABSOLUTE_ORDER_DETAIL_PATH, ST_ABSOLUTE_REVIEW_DETAIL_PATH } from '../../../constants';
import './style.css';
import ShopMain from '../../../components/Shopinformation';
import ReviewComponent from '../../../components/review';
import { GetReviewListResponseDto, GetStoreResponseDto } from '../../../apis/dto/response/stores';
import { getReviewListRequest } from '../../../apis';
import { ResponseDto } from '../../../apis/dto/response';
import { Review } from '../../../apis/dto/response/stores/get-review-list.response.dto';
import useReviewPagination from '../../../hooks/review-pagination.hook';
import ReviewPagination from '../../../components/review-pagination';


export default function ShopReview() {

  const {storeNumber} = useParams();

  const navigator = useNavigate();

  const { store } = useOutletContext<{ store: GetStoreResponseDto | null }>();

  // state: 원본 리스트 상태 //
  const [reviewList, setReviewList] = useState<Review[]>([]);

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

  // function: review list 불러오기 함수 //
  const getReviewList = () => {
    if(storeNumber) getReviewListRequest(storeNumber).then(getReviewListResponse);
  }

  // function: get review list response 처리 //
  const getReviewListResponse = (responseBody: null | ResponseDto | GetReviewListResponseDto) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'NS' ? '존재하지 않는 상점입니다.' : responseBody;

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if(!isSuccessed) {
      alert(message);
      return;
    }
    const {reviews} = responseBody as GetReviewListResponseDto;
    setReviewList(reviews);
    setTotalList(reviews);
  }

  //* 커스텀 훅 가져오기
  const {
    currentPage,
    totalPage,
    totalCount,
    viewList,
    pageList,
    setTotalList,
    initViewList,
    onPageClickHandler,
    onPreSectionClickHandler,
    onNextSectionClickHandler,
  } = useReviewPagination<Review>();

  // effect: 가게 리뷰 리스트 불러오기 //
  useEffect(getReviewList, []);

//   useEffect(() => {
//     initViewList(totalList);
// }, [currentPage]);

  return (
    <div id='store-detail-wrapper'>
      <div className='menu-bar-review'>
        <div className='shop-order' onClick={onOrderButtonClickHandler}>주문하기</div>
        <div className='shop-information' onClick={onInformationButtonClickHandler}>매장정보</div>
        <div className='shop-contact' onClick={onContactButtonClickHandler}>문의하기</div>
        <div className='shop-review' onClick={onReviewButtonClickHandler}>리뷰</div>
      </div>
      <div className='shop-review-bottom'>
        <div className='review-total'>전체 {totalCount}건</div>
        <div className='shop-review-bottom-list'>
          <div className='filter-left'></div>
          <div className='shop-review-list'>
          {/* {viewList.map((notice, index) => <NoticeRow key={index} notice={notice} getNoticeList={getNoticeList} onDetailClickHandler={onTrClickHandler} />)} */}
            {viewList.map((review, index) => <ReviewComponent reviewRating={review.reviewRating.toFixed(1)} reviewDay={review.reviewDay.split("T")[0]} 
                reviewContents={review.reviewContents} productName={review.productName} reviewPhotoUrl={review.imageUrls}
                imageCount={review.imageUrls.length} />)}
            {/* {reviewList.map((review, index) => 
              <ReviewComponent reviewRating={review.reviewRating.toFixed(1)} reviewDay={review.reviewDay.split("T")[0]} 
                reviewContents={review.reviewContents} productName={review.productName} reviewPhotoUrl={review.imageUrls}
                imageCount={review.imageUrls.length} />)
            } */}
          </div>
          <div className='filter-right'></div>
        </div>
      </div>

      <ReviewPagination
        pageList={pageList}
        currentPage={currentPage}
        onPageClickHandler={onPageClickHandler}
        onPreSectionClickHandler={onPreSectionClickHandler}
        onNextSectionClickHandler={onNextSectionClickHandler}/>

    </div>
  )
}
