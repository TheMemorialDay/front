import React, { useState } from 'react'
import './style.css';
import ReviewComponent from '../../../components/review';
import { useNavigate } from 'react-router-dom';
import { ST_ABSOLUTE_ORDER_DETAIL_PATH } from '../../../constants';

// component: 마이페이지 리뷰 컴포넌트 //
export default function MyReview() {

    // function: 네비게이터 //
    const navigator = useNavigate();

    // event handler: 상자 클릭 시 해당 가게 상세 페이지로 이동 //
    const onItemDetailClickHandler = (path: string) => {
        navigator(path);
    };

    // render: 마이페이지 리뷰 컴포넌트 렌더링 //
    return (
        <div id='mypage-review-wrapper'>
            <div className='title'>REVIEW</div>
            <div className='main'>
                <div className='main-title' onClick={() => onItemDetailClickHandler(ST_ABSOLUTE_ORDER_DETAIL_PATH)}>부산 케이크</div>
                <div className='review-box'>
                    <ReviewComponent
                        reviewRating="5.0"
                        reviewDay="2024 01 01"
                        reviewContents="모양도 예쁘고 맛도 있었어요!"
                        productName="딸기케이크"
                        reviewPhotoUrl="/picture1.png"
                        imageCount="3"
                    />
                </div>
            </div>

            {/* UI 확인용 복붙 잠시 */}
            <div className='main'>
                <div className='main-title' onClick={() => onItemDetailClickHandler(ST_ABSOLUTE_ORDER_DETAIL_PATH)}>부산 케이크</div>
                <div className='review-box'>
                    <ReviewComponent
                        reviewRating="5.0"
                        reviewDay="2024 01 01"
                        reviewContents="모양도 예쁘고 맛도 있었어요!"
                        productName="딸기케이크"
                        reviewPhotoUrl="/picture1.png"
                        imageCount="3"
                    />
                </div>
            </div>
        </div>
    )
}
