import React, { ChangeEvent, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import './style.css';
import { getStoreMainSearchRequest, postKeywordRequest } from '../../apis';
import { useSignInUserStore } from '../../stores';
import { GetStoreListResponseDto } from '../../apis/dto/response/stores';
import { ResponseDto } from '../../apis/dto/response';
import { deleteLikeStoreRequest, getStoreListRequest, postLikeStoreRequest } from '../../apis';
import { StoreComponentProps } from '../../types';
import { useNavigate } from 'react-router';
import { ACCESS_TOKEN, ST_ABSOLUTE_ORDER_DETAIL_PATH } from '../../constants';
import { PostLikeStoreRequestDto } from '../../apis/dto/request';
import { useCookies } from 'react-cookie';
import axios from 'axios';

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

interface StoreRowProps {
  store: StoreComponentProps,
  getStoreList: () => void;
}

// component: 스토어 리스트 아이템 컴포넌트 //
function StoreRow({ store, getStoreList }: StoreRowProps) {

  const navigator = useNavigate();

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: 로그인 유저 상태 //
  const { signInUser } = useSignInUserStore();

  const userId = signInUser?.userId;

  const onPostButtonClickHandler = () => {
    navigator(ST_ABSOLUTE_ORDER_DETAIL_PATH(store.storeNumber));
  };

  const [checked, setChecked] = useState<boolean>(false);

  const onHeartClickHandler = async (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (checked) {
      await onStoreLikeDeleteButtonClickHandler();
      store.likeList = store.likeList.filter(id => id !== userId); // 좋아요 삭제
      console.log('좋아요 삭제');
    } else if (!checked && userId !== undefined) {
      await onStoreLikeAddButtonClickHandler();
      store.likeList.push(userId); // 좋아요 추가
      console.log('좋아요 추가');

    }
  };

  // event handler: 가게 찜 버튼 등록 이벤트 처리 //
  const onStoreLikeAddButtonClickHandler = async () => {
    if (!store.storeNumber) {
      alert('가게에 문제가 있습니다 !');
      return;
    }

    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) {
      console.log('토큰 오류');
      return;
    }

    if (signInUser?.userId == null) {
      alert('유저 정보가 존재하지 않습니다!');
      return;
    }

    const requestBody: PostLikeStoreRequestDto = {
      userId: signInUser.userId,
      storeNumber: store.storeNumber,
    };

    postLikeStoreRequest(requestBody, accessToken).then(postLikeStoreResponse);
  }

  // event handler: 가게 찜 버튼 삭제 이벤트 처리 //
  const onStoreLikeDeleteButtonClickHandler = async () => {

    const accessToken = cookies[ACCESS_TOKEN];
    if (!accessToken) {
      alert('접근 권한이 없습니다');
      return;
    }

    const storeNumber = store.storeNumber;
    if (!store.storeNumber) {
      alert('가게에 문제가 있습니다 !');
      return;
    }

    const userId = signInUser?.userId;
    if (!userId) {
      alert('유저 정보가 존재하지 않습니다!');
      return;
    }

    deleteLikeStoreRequest(userId, storeNumber.toString(), accessToken).then(deleteLikeStoreResponse);
  }

  // function: post Like Store Response 처리 함수 //
  const postLikeStoreResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NS' ? '존재하지 않는 가게 입니다' :
              responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }

    if (store.storeNumber == null) {
      alert('가게정보가 존재하지 않습니다');
      return;
    }
    setChecked(true);
  }

  // function: delete Like Store Response 처리 함수 //
  const deleteLikeStoreResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
          responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NS' ? '존재하지 않는 가게 입니다' :
              responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }

    if (store.storeNumber == null) {
      alert('가게정보가 존재하지 않습니다');
      return;
    }
    setChecked(false);
  }

  // effect: 찜 상태 들고오기 //
  useEffect(() => {
    if (userId != null) {
      axios.get(`http://localhost:4000/stores/like?userId=${userId}`)
        .then(response => {
          const likedStores = response.data.likes.map((store: { storeNumber: any; }) => store.storeNumber);
          if (likedStores.includes(store.storeNumber)) {
            setChecked(true);
          }
        })
        .catch(error => console.error(error));
    }

  }, [store.storeNumber, userId]);

  // render: 스토어 리스트 컴포넌트 렌더링 //
  return (
    <div id="store-component-wrapper">
      <div className='store-card' onClick={onPostButtonClickHandler}>
        <div className='shop-image' style={{ backgroundImage: `url(${store.storeImageUrl})` }}></div>
        <div className='shop-info'>
          <div className='liked'>
            <h2 className="shop-name">{store.storeName}</h2>
            <div onClick={onHeartClickHandler} className={checked ? 'red-heart' : 'white-heart'}>
              <div className='like-count'>{store.likeList.length}</div>
            </div>
          </div>
          <div className='store-card-bottom'>
            <p className="shop-location">{store.storeGugun} {store.storeDong}</p>
            <p className="shop-rating">별점 {store.reviewRating.toFixed(1)}</p>
            <p className="shop-reviews">리뷰 {store.reviewCount}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ThemeProps {
  content: string;
  onRemove?: () => void;
}

// component: 선택된 상품 테마 컴포넌트 //
function SelectedThemes({ content, onRemove }: ThemeProps) {

  // render: 선택된 상품 태그 렌더링 //
  return (
    <div className='selected-theme-item'>
      <div className='x-sign' onClick={onRemove}>X</div>
      <div id='themes-item'>{content}</div>
    </div>
  )
}

//% 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인 메인
// component: 가게 화면 //
export default function Stores() {

  // component: 테마 //
  const CakeThemes = ['#심플', '#화려함', '#펑키', '#크리스마스', '#아이돌', '#졸업', '#귀여움', '#러블리', '#재미', '#할로윈', '#신년', '#효도', '#연인', '#어린이', '#웨딩', '#취업/승진'];

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

  // state: 원본 리스트 상태 //
  const originalList = useRef<StoreComponentProps[]>([]);

  // state: 테마 선택 셀렉터 오픈 여부 상태 //
  const [showThemeSelector, setShowThemeSelector] = useState<boolean>(false);

  // state: 픽업 가능 요일 셀렉터 오픈 여부 상태 //
  const [showPickUpSelector, setShowPickUpSelector] = useState<boolean>(false);

  // state: 구 셀렉터 오픈 여부 상태 //
  const [showGuSelector, setShowGuSelector] = useState<boolean>(false);

  // state: 동 셀렉터 오픈 여부 상태 //
  const [showDongSelector, setShowDongSelector] = useState<boolean>(false);

  // state: 선택된 태그 저장하는 상태 //
  const [selectedTag, setSelectedTag] = useState<string>('');

  // state: 선택된 테마를 저장하는 상태 //
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

  // state: 선택된 요일을 저장하는 상태 //
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);

  // state: 선택된 구군 저장하는 상태 //
  const [selectedGugun, setSelectedGugun] = useState<string>('');

  // state: 선택된 동 저장하는 상태 //
  const [selectedDong, setSelectedDong] = useState<string>('');

  // state: 선택된 구에 맞는 동 리스트 //
  const [dongList, setDongList] = useState<string[]>([]);

  // state: 당일 케이크 가능 여부 상태 //
  const [productToday, setProductToday] = useState<boolean>(false);

  // state: 메인 검색창 입력 상태 //
  const [mainSearch, setMainSearch] = useState<string>('');

  // state: 가게 리스트 상태 //
  const [storeList, setStoreList] = useState<StoreComponentProps[]>([]);

  // state: 정렬 상태 //
  const [sortType, setSortType] = useState<string>('');


  // event handler: 태그 클릭 이벤트 핸들러 //
  const onTagClickHandler = (tag: string) => {
    if (selectedTag === tag) setSelectedTag('');
    else setSelectedTag(tag); // 클릭된 태그를 상태로 저장
  };

  // event handler: 테마 클릭 이벤트 핸들러 //
  const checkThemeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (selectedThemes.includes(value)) {
      const newSelectedTemes = selectedThemes.filter(item => item !== value);
      setSelectedThemes(newSelectedTemes);
    }
    else {
      let selectedSize = selectedThemes.length + selectedWeekdays.length;
      if (selectedGugun) selectedSize++;
      if (selectedDong) selectedSize++;
      if (selectedSize >= 5) {
        alert('5개까지만 선택!');
        return;
      }
      const newSelectedThemes = [...selectedThemes, value];
      setSelectedThemes(newSelectedThemes);
    }
  };

  // event handler: 요일 선택 이벤트 처리 //
  const checkWeekdayHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (selectedWeekdays.includes(value)) {
      const newSelectedWeekdays = selectedWeekdays.filter(item => item !== value);
      setSelectedWeekdays(newSelectedWeekdays);
    }
    else {
      let selectedSize = selectedThemes.length + selectedWeekdays.length;
      if (selectedGugun) selectedSize++;
      if (selectedDong) selectedSize++;
      if (selectedSize >= 5) {
        alert('5개까지만 선택!');
        return;
      }
      const newSelectedWeekdays = [...selectedWeekdays, value];
      setSelectedWeekdays(newSelectedWeekdays);
    }
  };

  // event handler: 테마 셀렉터 오픈 이벤트 처리 //
  const onThemeSelectorClickHandler = () => {
    setShowThemeSelector(!showThemeSelector);

    if (showPickUpSelector == true || showGuSelector == true || showDongSelector == true) {
      setShowPickUpSelector(false);
      setShowGuSelector(false);
      setShowDongSelector(false);
    }
  }

  // event handler: 픽업 가능 요일 셀렉터 오픈 이벤트 처리 //
  const onPickUpSelectorClickHandler = () => {
    setShowPickUpSelector(!showPickUpSelector);

    if (showThemeSelector == true || showGuSelector == true || showDongSelector == true) {
      setShowThemeSelector(false);
      setShowGuSelector(false);
      setShowDongSelector(false);
    }
  }

  // event handler: 구 셀렉터 오픈 이벤트 처리 //
  const onGuSelectorClickHandler = () => {
    setShowGuSelector(!showGuSelector);

    if (showThemeSelector == true || showPickUpSelector == true || showDongSelector == true) {
      setShowThemeSelector(false);
      setShowPickUpSelector(false);
      setShowDongSelector(false);
    }
  }

  // event handler: 동 셀렉터 오픈 이벤트 처리 //
  const onDongSelectorClickHandler = () => {
    setShowDongSelector(!showDongSelector);

    if (showThemeSelector == true || showPickUpSelector == true || showGuSelector == true) {
      setShowThemeSelector(false);
      setShowPickUpSelector(false);
      setShowGuSelector(false);
    }
  }

  // event handler: 당일 케이크 상태 토글 이벤트 //
  const onToggledProductToday = () => {
    setProductToday(!productToday);
  }

  // event handler: 초기화 버튼 클릭 이벤트 //
  const onResetClickHandler = () => {
    setSelectedTag('')
    setSelectedThemes([]);
    setSelectedWeekdays([]);
    setSelectedGugun('');
    setSelectedDong('');
    setSortType('')
  }

  // event handler: 선택된 테마 삭제 클릭 이벤트 //
  const handleThemeRemove = (theme: string) => {
    setSelectedThemes(selectedThemes.filter(selectTheme => selectTheme !== theme));
  };

  // event handler: 선택된 요일 삭제 클릭 이벤트 //
  const handleWeekRemove = (weekday: string) => {
    setSelectedWeekdays(selectedWeekdays.filter(selectedWeekday => selectedWeekday !== weekday));
  };

  // event handler: 선택된 구군 삭제 클릭 이벤트 //
  const handleGugunRemove = () => {
    setSelectedGugun('');
    setSelectedDong('');
    setDongList([]);
  };

  // event handler: 선택된 동 삭제 클릭 이벤트 //
  const handleDongRemove = () => {
    setSelectedDong('');
  };

  // function: store list 불러오기 함수 //
  const getStoreLists = () => {
    getStoreListRequest().then(getStoreListResponse);
  }

  // function: get store list 불러오기 //
  const getStoreListResponse = (responseBody: GetStoreListResponseDto | ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }

    const { storeDetails } = responseBody as GetStoreListResponseDto;
    setStoreList(storeDetails);
    originalList.current = storeDetails;
  }

  //* ================================================================== keyword

  // function: 스토어 메인 검색창 키워드 저장하는 response 응답 처리 함수 //
  const postKeywordResponse = (responseBody: ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'VF' ? '입력값을 확인해주세요.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody != null && responseBody.code === 'SU';

    if (!isSuccessed) {
      alert(message);
      return;
    }
  };

  //* ================================================================== keyword

  //* ======================================== store main search
  // event handler: 검색어 입력 변경 이벤트 핸들러 //
  const onMainSearchChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setMainSearch(value);

    if (value == null) {
      setMainSearch('');
    }
  };

  // event handler: 검색어 입력 후 요청하는 이벤트 핸들러 //
  const onStoresSearchClickHandler = () => {

    getStoreMainSearchRequest(mainSearch).then(getStoresMainSearchResponse);
    postKeywordRequest(mainSearch).then(postKeywordResponse);
  };

  // event handler: 검색어 입력 후 요청할 때 키보드 핸들러 //
  const onStoresSearchKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onStoresSearchClickHandler();
    }
  };

  // function: 스토어 메인 검색창 검색 시 response 응답 처리 함수 //
  const getStoresMainSearchResponse = (responseBody: GetStoreListResponseDto | ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '입력값을 확인해주세요.' :
          responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody != null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }

    const { storeDetails } = responseBody as GetStoreListResponseDto;
    setStoreList(storeDetails);
    originalList.current = storeDetails;

    setMainSearch('');
  };
  //* ======================================== store main search

  // event handler: 선택된 구군으로 주소 불러오기 //
  const onStoresSeletedGugunHandler = (gugun: string) => {

    let selectedSize = selectedThemes.length + selectedWeekdays.length;
    if (selectedGugun) selectedSize++;
    if (selectedDong) selectedSize++;
    if (selectedSize >= 5 && !selectedGugun) {
      alert('5개까지만 선택!');
      return;
    }

    setSelectedGugun(gugun);
    const dongList = address[gugun];
    setDongList(dongList);
    setShowGuSelector(false);
  }

  // event handler: 선택된 동으로 주소 불러오기 //
  const onStoresSeletedDongHandler = (dong: string) => {

    let selectedSize = selectedThemes.length + selectedWeekdays.length;
    if (selectedGugun) selectedSize++;
    if (selectedDong) selectedSize++;
    if (selectedSize >= 5 && !selectedDong) {
      alert('5개까지만 선택!');
      return;
    }

    setSelectedDong(dong);
    setShowDongSelector(false);
  };

  // event handler: 정렬 선택 이벤트 처리 //
  const onSortSelectHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (sortType === value) setSortType('');
    else setSortType(value);
  };

  //* ========================================== store main address selected

  // effect: 로드시 상점 리스트 불러오기 함수 //
  useEffect(getStoreLists, []);

  // effect: 조건 변경시 실행할 함수 //
  useEffect(() => {

    let storeList = [...originalList.current];

    // ! 태그 필터링
    if (selectedTag) {
      storeList = storeList.filter(item => item.productTag.includes(selectedTag))
    }

    // ! 테마 필터링
    if (selectedThemes.length) {
      storeList = storeList.filter(item => {
        // 모든 테마 그룹을 하나의 배열로 합치기
        const allThemes = item.themes.flat();
        // selectedThemes의 모든 요소가 allThemes에 포함되어 있는지 확인
        const existed = selectedThemes.every(theme => allThemes.includes(theme));

        console.log(allThemes);
        return existed;
      });
    }

    // ! 픽업 요일 필터링
    if (selectedWeekdays.length) {

      storeList = storeList.filter(itme => {
        let existed = false;

        for (const selectedWeekday of selectedWeekdays) {
          if (selectedWeekday === '월요일') {
            if (itme.mondayOpen !== '휴무일') {
              existed = true;
              break;
            }
          }

          if (selectedWeekday === '화요일') {
            if (itme.tuesdayOpen !== '휴무일') {
              existed = true;
              break;
            }
          }

          if (selectedWeekday === '수요일') {
            if (itme.wednesdayOpen !== '휴무일') {
              existed = true;
              break;
            }
          }

          if (selectedWeekday === '목요일') {
            if (itme.thursdayOpen !== '휴무일') {
              existed = true;
              break;
            }
          }

          if (selectedWeekday === '금요일') {
            if (itme.fridayOpen !== '휴무일') {
              existed = true;
              break;
            }
          }

          if (selectedWeekday === '토요일') {
            if (itme.saturdayOpen !== '휴무일') {
              existed = true;
              break;
            }
          }

          if (selectedWeekday === '일요일') {
            if (itme.sundayOpen !== '휴무일') {
              existed = true;
              break;
            }
          }
        }
        return existed;
      })
    };

    // ! 구군 필터링
    if (selectedGugun) {
      storeList = storeList.filter(item => item.storeGugun === selectedGugun);
    }

    // ! 동 필터링
    if (selectedDong) {
      storeList = storeList.filter(item => item.storeDong === selectedDong);
    }

    // ! 당일 픽업 가능 필터링
    if (productToday) {
      storeList = storeList.filter(item => item.productToday.includes(true));
    }

    // ! 찜 수 정렬
    if (sortType === 'popularity') storeList = storeList.sort((a, b) => b.likeList.length - a.likeList.length);
    if (sortType === 'rating') storeList = storeList.sort((a, b) => b.reviewRating - a.reviewRating);
    if (sortType === 'review') storeList = storeList.sort((a, b) => b.reviewCount - a.reviewCount);

    setStoreList(storeList);

  }, [selectedTag, selectedThemes, selectedWeekdays, selectedGugun, selectedDong, productToday, sortType]);

  // render: 스토어 메인 컴포넌트 렌더링 //
  return (
    <div id='store-wrapper'>
      <div className='store-top'>
        <div className='store-notice'>
          <div className='store-ment'>
            <div>찾으시는</div>
            <div><strong>가게이름 & 상품</strong>을</div>
            <div>검색하세요 !</div>
          </div>
          <div className='search'>
            <input
              className='store-search'
              placeholder='검색어 입력'
              onChange={onMainSearchChangeHandler}
              onKeyDown={onStoresSearchKeyDownHandler}
              value={mainSearch}
            />
            <img onClick={onStoresSearchClickHandler} src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/icon/search.png" />
          </div>
        </div>
      </div>
      <div className='store-filter'>
        <div className='filter-box'>
          <div className='store-filter' style={{ marginBottom: "30px" }}>
            <div className='filter-box'>
              <CakeComponent imageUrl="/photo.png" context="포토" isSelected={selectedTag === "포토"} onClick={() => onTagClickHandler("포토")} />
              <CakeComponent imageUrl="/abc.png" context="레터링" isSelected={selectedTag === "레터링"} onClick={() => onTagClickHandler("레터링")} />
              <CakeComponent imageUrl="/piece.png" context="한입 케이크" isSelected={selectedTag === "한입 케이크"} onClick={() => onTagClickHandler("한입 케이크")} />
              <CakeComponent imageUrl="/box.png" context="도시락 케이크" isSelected={selectedTag === "도시락 케이크"} onClick={() => onTagClickHandler("도시락 케이크")} />
              <CakeComponent imageUrl="/level.png" context="이단 케이크" isSelected={selectedTag === "이단 케이크"} onClick={() => onTagClickHandler("이단 케이크")} />
              <CakeComponent imageUrl="/leaf.png" context="비건 케이크" isSelected={selectedTag === "비건 케이크"} onClick={() => onTagClickHandler("비건 케이크")} />
              <CakeComponent imageUrl="/ricecake_final.png" context="떡 케이크" isSelected={selectedTag === "떡 케이크"} onClick={() => onTagClickHandler("떡 케이크")} />
            </div>
          </div>
        </div>
      </div>
      <div className='store-box'>
        <div className="sorting-header">
          <div className="item-count">전체 {storeList.length}개</div>

          {/* 정렬 */}
          <div className="sorting-dropdown">
            <select onChange={onSortSelectHandler}>
              <option value="system">기본순</option>
              <option value="popularity">인기순</option>
              <option value="rating">별점순</option>
              <option value="review">리뷰순</option>
            </select>
          </div>

        </div>
        <div className="dropdown-container">
          <div className='label'>
            {showThemeSelector ?
              <div className='selector open'>
                <div className='selected-item'>케이크 테마</div>
                <div className='arrow-up-button' onClick={onThemeSelectorClickHandler}></div>
                <div className='selector-theme-box'>
                  <div className='selector-cake-tag'>
                    {CakeThemes.map((item, idx) => (
                      <div className='checkbox' key={idx}>
                        <input type='checkbox' id={item} checked={selectedThemes.includes(item)}
                          value={item}
                          onChange={checkThemeHandler} />
                        <label htmlFor={item}>{item}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div> :
              <div className='selector close'>
                <div className='selected-item'>케이크 테마</div>
                <div className='arrow-down-button' onClick={onThemeSelectorClickHandler}></div>
              </div>
            }
          </div>

          <div className='label'>
            {showPickUpSelector ?
              <div className='selector open'>
                <div className='selected-item'>픽업 가능 요일</div>
                <div className='arrow-up-button' onClick={onPickUpSelectorClickHandler}></div>
                <div className='selector-week-box'>
                  <div className='selector-cake-tag'>
                    {Day.map((item, idx) => (
                      <div className='checkbox' key={idx}>
                        <input type='checkbox' id={item} checked={selectedWeekdays.includes(item)} value={item}
                          onChange={checkWeekdayHandler} />
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
                  <div className='selected-item'>{selectedGugun ? selectedGugun : '구/군 선택'}</div>
                  <div className='arrow-up-button' onClick={onGuSelectorClickHandler}></div>
                  <div className='selector-box'>
                    {Object.keys(address).map(gu => (
                      <div key={gu} className='selector-option' onClick={() => onStoresSeletedGugunHandler(gu)}>{gu}</div>
                    ))}
                  </div>
                </div> :
                <div className='selectors close'>
                  <div className='selected-item'>{selectedGugun ? selectedGugun : '구/군 선택'}</div>
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
                      <div key={dong} className='selector-option' onClick={() => onStoresSeletedDongHandler(dong)}>{dong}</div>
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
                <div className='selected-today' onClick={onToggledProductToday} style={{ color: 'white' }}>당일 케이크 가능</div>
              </div> :
              <div className='selector close'>
                <div className='selected-today' onClick={onToggledProductToday}>당일 케이크 가능</div>
              </div>
            }
          </div>

        </div>
        <div className="theme-container">
          <div className="themes-container">
            {selectedThemes.map(theme => <SelectedThemes key={theme} content={theme} onRemove={() => handleThemeRemove(theme)} />)}
            {selectedWeekdays.map(weekday => <SelectedThemes key={weekday} content={weekday} onRemove={() => handleWeekRemove(weekday)} />)}
            {selectedGugun !== '' && <SelectedThemes content={selectedGugun} onRemove={handleGugunRemove} />}
            {selectedDong !== '' && <SelectedThemes content={selectedDong} onRemove={handleDongRemove} />}
          </div>
          <button className="reset-button" onClick={onResetClickHandler}>초기화 ↻</button>
        </div>
        <div className='shop-list'>
          {
            storeList.map((store) => <StoreRow key={store.storeNumber} store={store} getStoreList={getStoreLists} />)
          }
        </div>

        {/* <div className='store-bottom'>
            <Pagination
              pageList={pageList}
              currentPage={currentPage}
              onPageClickHandler={onPageClickHandler}
              onPreSectionClickHandler={onPreSectionClickHandler}
              onNextSectionClickHandler={onNextSectionClickHandler}
            />
          </div> */}

      </div>
    </div >
  )
}