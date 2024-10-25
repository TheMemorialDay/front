import React, { useState } from 'react'
import './style.css';
import StoreComponent from '../../components/storeThumbnail';
import { useSortStore } from '../../stores';

interface CakeComponentProps {
  imageUrl: string;
  context: string;
  isSelected: boolean;
  onClick: () => void;
}

// component: 케이크 태그 컴포넌트 //
function CakeComponent({ imageUrl, context, isSelected, onClick }: CakeComponentProps) {

  // render: 케이크 태그 렌더링 //
  return (
    <div className='filter-cake' onClick={onClick}
      style={{
        cursor: "pointer", userSelect: "none",
        backgroundColor: isSelected ? 'rgba(211, 211, 211, 0.3)' : 'transparent',
        padding: "15px", margin: "-4px"
      }}>
      <div className='circle-box'>
        <div className='circle' style={{ backgroundImage: `url(${imageUrl})` }}></div>
      </div>
      <div className='context' style={{ fontSize: "18px" }}>{context}</div>
    </div>
  );
}

// component: 케이크 정렬 방식 //
function CakeSorting() {
  // state: 케이크 정렬 상태 //
  const { stores, sortedStores, setStores, setSortBy } = useSortStore();

  return (
    <select>
      <optgroup label="정렬 방식">
        <option value="popularity">인기순</option>
        <option value="rating">별점순</option>
        <option value="review">리뷰순</option>
      </optgroup>
    </select>
  );
}

interface TagProps {
  content: string;
  onRemove?: () => void;
}

// component: 선택된 상품 테마 컴포넌트 //
function SelectedTags({ content, onRemove }: TagProps) {

  // render: 선택된 상품 태그 렌더링 //
  return (
    <div className='selected-tag-item'>
      <div className='x-sign' onClick={onRemove}>X</div>
      <div id='tags-item'>{content}</div>
    </div>
  )
}

// component: 가게 화면 //
export default function Stores() {

  // component: 태그 //
  const CakeTag = ['심플', '화려함', '펑키', '크리스마스', '아이돌', '졸업', '귀여움', '러블리', '재미', '할로윈', '신년', '효도', '연인', '어린이', '웨딩', '취업/승진'];

  // component: 요일 //
  const Day = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

  // component: 구와 동 //
  const address: { [key: string]: string[] } = {
    '강서구': ['대저동', '강동동', '명지동', '가락동', '녹산동', '가덕도동'],
    '금정구': ['서동', '금사동', '부곡동', '장전동', '선두구동', '청룡노포동', '남산동', '구서동', '금성동'],
    '기장군': ['기장읍', '장안읍', '정관읍', '일광읍', '철마면'],
    '남구': ['대연동', '용호동', '용당동', '감만동', '우암동', '문현동'],
    '동구': ['초량동', '수정동', '좌천동', '범일동'],
    '동래구': ['수민동', '복산동', '명륜동', '온천동', '사직동', '안락동', '명장동'],
    '부산진구': ['부전동', '연지동', '초읍동', '양정동', '전포동', '부암동', '당감동', '가야동', '개금동', '범천동'],
    '북구': ['구포동', '금곡동', '화명동', '덕천동', '만덕동'],
    '사상구': ['삼락동', '모라동', '덕포동', '괘법동', '감전동', '주례동', '학장동', '엄궁동'],
    '사하구': ['괴정동', '당리동', '감천동', '다대동', '구평동', '장림동', '신평동', '하단동'],
    '서구': ['동대신동', '서대신동', '부민동', '아미동', '초장동', '충무동', '남부민동', '암남동'],
    '수영구': ['남천동', '수영동', '망미동', '광안동', '민락동'],
    '영도구': ['남항동', '영선동', '신선동', '봉래동', '청학동', '동삼동'],
    '연제구': ['거제동', '연산동'],
    '중구': ['중앙동', '동광동', '대청동', '보수동', '부평동', '광복동', '남포동', '영주동'],
    '해운대구': ['우동', '중동', '좌동', '송정동', '반여동', '반송동', '재송동']

  }

  // state: 선택된 태그를 저장하는 상태 //
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // state: 태그가 선택되었는지 확인하는 상태 //
  const [isChecked, setIsChecked] = useState<boolean>(false);

  // state: 태그 선택 셀렉터 오픈 여부 상태 //
  const [showTagSelector, setShowTagSelector] = useState<boolean>(false);

  // state: 선택된 테마를 저장하는 상태 //
  const [selectedThema, setSelectedThema] = useState<string | null>();

  // state: 픽업 가능 요일 셀렉터 오픈 여부 상태 //
  const [showPickUpSelector, setShowPickUpSelector] = useState<boolean>(false);

  // state: 구 셀렉터 오픈 여부 상태 //
  const [showGuSelector, setShowGuSelector] = useState<boolean>(false);

  // state: 선택된 구 //
  const [selectedGu, setSelectGu] = useState<string | null>(null);

  // state: 동 셀렉터 오픈 여부 상태 //
  const [showDongSelector, setShowDongSelector] = useState<boolean>(false);

  // state: 선택된 동 //
  const [selectedDong, setSelectedDong] = useState<string | null>(null);

  // state: 선택된 구에 맞는 동 리스트 //
  const [dongList, setDongList] = useState<string[]>([]);

  // state: 당일 케이크 가능 여부 상태 //
  const [productToday, setProductToday] = useState<boolean>(false);

  // event handler: 테마 클릭 이벤트 핸들러 //
  const onThemaClickHandler = (thema: string) => {
    setSelectedThema(thema); // 클릭된 태그를 상태로 저장
  };

  // event handler: 태그 체크 처리 이벤트 핸들러 //
  const onTagClickHandler = (tag: string, isChecked: boolean) => {
    if (isChecked && selectedTags.length < 5) {
      setSelectedTags((prev) => [...prev, tag]);
      return;
    }

    if (!isChecked && selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((item) => item !== tag));
      return;
    }

    if (selectedTags.length >= 5) {
      alert('태그는 최대 5개까지만 선택할 수 있습니다.');
      return;
    }
  };

  // event handler: 태그 클릭 이벤트 핸들러 //
  const checkTagHandler = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setIsChecked(!isChecked);
    onTagClickHandler(value, event.target.checked);
  };

  // event handler: 태그 셀렉터 오픈 이벤트 처리 //
  const onTagSelectorClickHandler = () => {
    setShowTagSelector(!showTagSelector);

    if (showPickUpSelector == true || showGuSelector == true || showDongSelector == true) {
      setShowPickUpSelector(false);
      setShowGuSelector(false);
      setShowDongSelector(false);
    }
  }

  // event handler: 픽업 가능 요일 셀렉터 오픈 이벤트 처리 //
  const onPickUpSelectorClickHandler = () => {
    setShowPickUpSelector(!showPickUpSelector);

    if (showTagSelector == true || showGuSelector == true || showDongSelector == true) {
      setShowTagSelector(false);
      setShowGuSelector(false);
      setShowDongSelector(false);
    }
  }

  // event handler: 구 셀렉터 오픈 이벤트 처리 //
  const onGuSelectorClickHandler = () => {
    setShowGuSelector(!showGuSelector);

    if (showTagSelector == true || showPickUpSelector == true || showDongSelector == true) {
      setShowTagSelector(false);
      setShowPickUpSelector(false);
      setShowDongSelector(false);
    }
  }

  // event handler: 동 셀렉터 오픈 이벤트 처리 //
  const onDongSelectorClickHandler = () => {
    setShowDongSelector(!showDongSelector);

    if (showTagSelector == true || showPickUpSelector == true || showGuSelector == true) {
      setShowTagSelector(false);
      setShowPickUpSelector(false);
      setShowGuSelector(false);
    }
  }

  // event handler: 구 선택시 동 리스트 업데이트 //
  const onSelectedGu = (gu: string) => {
    setSelectGu(gu);
    setDongList(address[gu]);
    console.log(address[gu]);
    setSelectedDong(null);
    setShowGuSelector(false);
  }

  // event handler: 동 선택시 선택 업데이트 //
  const onSelectedDong = (dong: string) => {
    setSelectedDong(dong);
    setShowDongSelector(false);
  }

  // event handler: 당일 케이크 선택 이벤트 //
  const onSelectedProductToday = () => {
    setProductToday(!productToday);
  }

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
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
          <div className='store-filter' style={{ marginBottom: "30px" }}>
            <div className='filter-box'>
              <CakeComponent imageUrl="/photo.png" context="포토" isSelected={selectedThema === "포토"} onClick={() => onThemaClickHandler("포토")} />
              <CakeComponent imageUrl="/abc.png" context="레터링" isSelected={selectedThema === "레터링"} onClick={() => onThemaClickHandler("레터링")} />
              <CakeComponent imageUrl="/piece.png" context="한입 케이크" isSelected={selectedThema === "한입 케이크"} onClick={() => onThemaClickHandler("한입 케이크")} />
              <CakeComponent imageUrl="/box.png" context="도시락 케이크" isSelected={selectedThema === "도시락 케이크"} onClick={() => onThemaClickHandler("도시락 케이크")} />
              <CakeComponent imageUrl="/level.png" context="이단 케이크" isSelected={selectedThema === "이단 케이크"} onClick={() => onThemaClickHandler("이단 케이크")} />
              <CakeComponent imageUrl="/today.png" context="당일 케이크" isSelected={selectedThema === "당일 케이크"} onClick={() => onThemaClickHandler("당일 케이크")} />
              <CakeComponent imageUrl="/leaf.png" context="비건 케이크" isSelected={selectedThema === "비건 케이크"} onClick={() => onThemaClickHandler("비건 케이크")} />
              <CakeComponent imageUrl="/ricecake_final.png" context="떡 케이크" isSelected={selectedThema === "떡 케이크"} onClick={() => onThemaClickHandler("떡 케이크")} />
            </div>
          </div>
        </div>
      </div>
      <div className='store-box'>
        <div className="sorting-header">
          <div className="item-count">전체 100개 중 21개</div>
          <div className="sorting-dropdown">
            <CakeSorting />
          </div>
        </div>
        <div className="dropdown-container">
          <div className='label'>
            {showTagSelector ?
              <div className='selector open'>
                <div className='selected-item'>케이크 태그</div>
                <div className='arrow-up-button' onClick={onTagSelectorClickHandler}></div>
                <div className='selector-tag-box'>
                  <div className='selector-cake-tag'>
                    {CakeTag.map((item, idx) => (
                      <div className='checkbox' key={idx}>
                        <input type='checkbox' id={item} checked={selectedTags.includes(item)}
                          onChange={(event) => checkTagHandler(event, item)} />
                        <label htmlFor={item}>{item}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div> :
              <div className='selector close'>
                <div className='selected-item'>케이크 태그</div>
                <div className='arrow-down-button' onClick={onTagSelectorClickHandler}></div>
              </div>
            }
          </div>

          <div className='label'>
            {showPickUpSelector ?
              <div className='selector open'>
                <div className='selected-item'>픽업 가능 요일</div>
                <div className='arrow-up-button' onClick={onPickUpSelectorClickHandler}></div>
                <div className='selector-tag-box'>
                  <div className='selector-cake-tag'>
                    {Day.map((item, idx) => (
                      <div className='checkbox' key={idx}>
                        <input type='checkbox' id={item} checked={selectedTags.includes(item)}
                          onChange={(event) => checkTagHandler(event, item)} />
                        <label htmlFor={item}>{item}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div> :
              <div className='selector close'>
                <div className='selected-item'>픽업 가능 요일</div>
                <div className='arrow-down-button' onClick={onPickUpSelectorClickHandler}></div>
              </div>
            }
          </div>

          <div className='address-select'> 주소선택
            <div className='label'>
              {showGuSelector ?
                <div className='selectors open'>
                  <div className='selected-item'>{selectedGu ? selectedGu : '구/군 선택'}</div>
                  <div className='arrow-up-button' onClick={onGuSelectorClickHandler}></div>
                  <div className='selector-box'>
                    {Object.keys(address).map(gu => (
                      <div key={gu} className='selector-option' onClick={() => onSelectedGu(gu)}>{gu}</div>
                    ))}
                  </div>
                </div> :
                <div className='selectors close'>
                  <div className='selected-item'>{selectedGu ? selectedGu : '구/군 선택'}</div>
                  <div className='arrow-down-button' onClick={onGuSelectorClickHandler}></div>
                </div>
              }
            </div>

            <div className='label'>
              {showDongSelector ?
                <div className='selectors open'>
                  <div className='selected-item'>{selectedDong ? selectedDong : '동/읍/면 선택'}</div>
                  <div className='arrow-up-button' onClick={onDongSelectorClickHandler}></div>
                  <div className='selector-box'>
                    {dongList.map(dong => (
                      <div key={dong} className='selector-option' onClick={() => onSelectedDong(dong)}>{dong}</div>
                    ))}
                  </div>
                </div> :
                <div className='selectors close'>
                  <div className='selected-item'>{selectedDong ? selectedDong : '동/읍/면 선택'}</div>
                  <div className='arrow-down-button' onClick={onDongSelectorClickHandler}></div>
                </div>
              }
            </div>
          </div>

          <div className='label'>
            {productToday ?
              <div className='selector open' style={{ backgroundColor: 'black' }}>
                <div className='selected-today' onClick={onSelectedProductToday} style={{ color: 'white' }}>당일 케이크 가능</div>
              </div> :
              <div className='selector close'>
                <div className='selected-today' onClick={onSelectedProductToday}>당일 케이크 불가능</div>
              </div>
            }
          </div>

        </div>
        <div className="tag-container">
          <div className="tags-container">
            {selectedTags.length === 0 ? '' :
              <div>
                <div style={{ display: "flex", flexDirection: "row" }}> {selectedTags.map(tag => (<SelectedTags key={tag} content={tag}
                  onRemove={() => handleTagRemove(tag)} />))}</div>
              </div>
            }
          </div>
          <button className="reset-button">초기화 ↻</button>
        </div>
        <div className='shop-list'>
          <StoreComponent storeImageUrl="/picture1.png" storeName="이도씨 베이킹" location="금정구 부곡동" reviewRating={4.5} reviews={127} />
          <StoreComponent storeImageUrl="/picture12.png" storeName="어스 베이킹" location="금정구 장전동" reviewRating={4.3} reviews={291} />
          <StoreComponent storeImageUrl="/picture13.png" storeName="바닐바닐" location="금정구 장전동" reviewRating={3.8} reviews={83} />
          <StoreComponent storeImageUrl="/picture14.png" storeName="온도 케이크" location="동래구 명륜동" reviewRating={4.0} reviews={333} />
        </div>
      </div>
    </div >
  )
}
