import React from 'react'
import './style.css';
import ReviewComponent from '../../../components/review';

export default function MyReview() {
    return (
        <div id='mypage-review-wrapper'>
            <div className='title'>REVIEW</div>
            <div className='main'>
                <div className='main-title'>부산 케이크</div>
                <div className='review-box'>
                    <ReviewComponent
                        rating="5.0"
                        date="2024 01 01"
                        review="모양도 예쁘고 맛도 있었어요!"
                        product="딸기케이크"
                        image="/picture1.png"
                        imageCount="3"
                    />
                </div>
            </div>

            {/* UI 확인용 복붙 잠시 */}
            <div className='main'>
                <div className='main-title'>부산 케이크</div>
                <div className='review-box'>
                    <ReviewComponent
                        rating="5.0"
                        date="2024 01 01"
                        review="모양도 예쁘고 맛도 있었어요!"
                        product="딸기케이크"
                        image="/picture1.png"
                        imageCount="3"
                    />
                </div>
            </div>
        </div>
    )
}
