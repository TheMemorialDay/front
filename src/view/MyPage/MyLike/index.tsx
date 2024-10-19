import React from 'react'
import './style.css';
import StoreComponent from '../../../components/storeThumbnail';

export default function MyLike() {
    return (
        <div id='mypage-like-wrapper'>
            <div className='title'>찜한 가게</div>
            <div className='main'>
                <StoreComponent imageUrl="/picture1.png" name="이도씨 베이킹" location="금정구 부곡동" rating={4.5} reviews={127} />
                <StoreComponent imageUrl="/picture12.png" name="어스 베이킹" location="금정구 장전동" rating={4.3} reviews={291} />
                <StoreComponent imageUrl="/picture13.png" name="바닐바닐" location="금정구 장전동" rating={3.8} reviews={83} />
                <StoreComponent imageUrl="/picture14.png" name="온도 케이크" location="동래구 명륜동" rating={4.0} reviews={333} />

                {/* UI 확인용 복붙 */}
                <StoreComponent imageUrl="/picture1.png" name="이도씨 베이킹" location="금정구 부곡동" rating={4.5} reviews={127} />
                <StoreComponent imageUrl="/picture12.png" name="어스 베이킹" location="금정구 장전동" rating={4.3} reviews={291} />
                <StoreComponent imageUrl="/picture13.png" name="바닐바닐" location="금정구 장전동" rating={3.8} reviews={83} />
                <StoreComponent imageUrl="/picture14.png" name="온도 케이크" location="동래구 명륜동" rating={4.0} reviews={333} />
            </div>
        </div>
    )
}
