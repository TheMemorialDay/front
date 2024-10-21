import React from 'react'
import './style.css';
import StoreComponent from '../../../components/storeThumbnail';

export default function MyLike() {
    return (
        <div id='mypage-like-wrapper'>
            <div className='title'>찜한 가게</div>
            <div className='main'>
                <StoreComponent storeImageUrl="/picture1.png" storeName="이도씨 베이킹" location="금정구 부곡동" reviewRating={4.5} reviews={127} />
                <StoreComponent storeImageUrl="/picture12.png" storeName="어스 베이킹" location="금정구 장전동" reviewRating={4.3} reviews={291} />
                <StoreComponent storeImageUrl="/picture13.png" storeName="바닐바닐" location="금정구 장전동" reviewRating={3.8} reviews={83} />
                <StoreComponent storeImageUrl="/picture14.png" storeName="온도 케이크" location="동래구 명륜동" reviewRating={4.0} reviews={333} />

                {/* UI 확인용 복붙 */}
                <StoreComponent storeImageUrl="/picture1.png" storeName="이도씨 베이킹" location="금정구 부곡동" reviewRating={4.5} reviews={127} />
                <StoreComponent storeImageUrl="/picture12.png" storeName="어스 베이킹" location="금정구 장전동" reviewRating={4.3} reviews={291} />
                <StoreComponent storeImageUrl="/picture13.png" storeName="바닐바닐" location="금정구 장전동" reviewRating={3.8} reviews={83} />
                <StoreComponent storeImageUrl="/picture14.png" storeName="온도 케이크" location="동래구 명륜동" reviewRating={4.0} reviews={333} />
            </div>
        </div>
    )
}
