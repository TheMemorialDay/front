import React, { useState } from 'react'
import './style.css';
import { useNavigate } from 'react-router';
import { ST_ABSOLUTE_ORDER_DETAIL_PATH } from '../../constants';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

interface CakeComponentProps {
  imageUrl: string;
  context: string;
}

function CakeComponent({ imageUrl, context }: CakeComponentProps) {
  return (
    <div className='filter-cake'>
      <div className='circle-box'>
        <div className='circle' style={{ backgroundImage: `url(${imageUrl})` }}></div>
      </div>
      <div className='context'>{context}</div>
    </div >
  );
}



function FilterMenu() {
  return (
    <div>
      <div className="dropdown-container">
        <select>
          <option>케이크 테마</option>
          <option value="생일 케이크">생일 케이크</option>
          <option value="기념일 케이크">기념일 케이크</option>
        </select>

        <select>
          <option>픽업 가능 요일</option>
          <option value="월요일">월요일</option>
          <option value="화요일">화요일</option>
          <option value="수요일">수요일</option>
        </select>

        <select>
          <option>당일 케이크 여부</option>
          <option value="가능">가능</option>
          <option value="불가능">불가능</option>
        </select>

        <select>
          <option>구를 선택하세요</option>
          <option value="금정구">금정구</option>
          <option value="동래구">동래구</option>
          <option value="해운대구">해운대구</option>
        </select>

        <select>
          <option>동을 선택하세요</option>
          <option value="부곡동">부곡동</option>
          <option value="장전동">장전동</option>
          <option value="남산동">남산동</option>
        </select>
      </div>
      <div className="tag-container">
        <div className="tags-container">
          <div className="tag"> <span className="remove-tag">x</span>생일 케이크</div>
          <div className="tag"> <span className="remove-tag">x</span>월요일</div>
          <div className="tag"> <span className="remove-tag">x</span>가능</div>
          <div className="tag"> <span className="remove-tag">x</span>금정구</div>
          <div className="tag"> <span className="remove-tag">x</span>부곡동</div>
        </div>
        <button className="reset-button">초기화 ↻</button>
      </div>
    </div >
  );
};

export default function Stores() {

  const [checked, setChecked] = useState<boolean>(false);

  const onHeartClickHandler = () => {
    // event.stopPropagation();
    checked ? setChecked(false) : setChecked(true);
  };


  interface StoreComponentProps {
    imageUrl: string;
    name: string;
    location: string;
    rating: number;
    reviews: number;
  }

  function StoreComponent({ imageUrl, name, location, rating, reviews }: StoreComponentProps) {
    return (
      <div className='store-card' onClick={onPostButtonClickHandler}>
        <div className='shop-image' style={{ backgroundImage: `url(${imageUrl})` }}></div>
        <div className='shop-info'>
          <h2 className="shop-name">{name}    {checked ? <HeartFilled onClick={onHeartClickHandler} /> : <HeartOutlined onClick={onHeartClickHandler} />}</h2>
          <p className="shop-location">{location}</p>
          <p className="shop-rating">별점 {rating}</p>
          <p className="shop-reviews">리뷰 {reviews}</p>
        </div>
      </div>
    );
  }

  const navigator = useNavigate();

  const onPostButtonClickHandler = () => {
    navigator(ST_ABSOLUTE_ORDER_DETAIL_PATH);
  };

  return (
    <div id='store-wrapper'>
      <div className='store-top'>
        <div className='store-notice'>
          <div className='store-ment'>
            <div>찾으시는</div>
            <div><strong>가게이름 & 상품을</strong></div>
            <div>검색하세요 !</div>
          </div>
          <div className='search'>
            <input className='store-search' placeholder='검색어 입력' />
            <img src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/icon/search.png" />
          </div>
        </div>
      </div>
      <div className='store-filter'>
        <div className='filter-box'>
          <div className='filter-left'></div>
          <CakeComponent imageUrl="/photo.png" context="포토" />
          <CakeComponent imageUrl="/abc.png" context="레터링" />
          <CakeComponent imageUrl="/piece.png" context="한입 케이크" />
          <CakeComponent imageUrl="/box.png" context="도시락 케이크" />
          <CakeComponent imageUrl="/level.png" context="이단 케이크" />
          <CakeComponent imageUrl="/today.png" context="당일 케이크" />
          <div className='filter-right'></div>
        </div>
      </div>
      <div className='store-box'>
        <div className="sorting-header">
          <div className="item-count">전체 100개 중 21개</div>
          <div className="sorting-dropdown">
            <select>
              <option>정렬 방식</option>
              <option value="popularity">인기순</option>
              <option value="rating">별점순</option>
              <option value="review">리뷰순</option>
            </select>
          </div>
        </div>
        <FilterMenu />
        <div className='shop-list'>
          <StoreComponent imageUrl="/그림1.png" name="이도씨 베이킹" location="금정구 부곡동" rating={4.5} reviews={127} />
          <StoreComponent imageUrl="/그림2.png" name="어스 베이킹" location="금정구 장전동" rating={4.3} reviews={291} />
          <StoreComponent imageUrl="/그림3.png" name="바닐바닐" location="금정구 장전동" rating={3.8} reviews={83} />
          <StoreComponent imageUrl="/그림4.png" name="온도 케이크" location="동래구 명륜동" rating={4.0} reviews={333} />
        </div>
      </div>
    </div >
  )
}
