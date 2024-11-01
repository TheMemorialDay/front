import React, { useEffect, useState } from 'react'
import './style.css';
import { getStoreRequest } from '../../apis';
import { Outlet, useNavigate, useParams } from 'react-router';
import { GetStoreResponseDto } from '../../apis/dto/response/stores';
import { ResponseDto } from '../../apis/dto/response';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN } from '../../constants';


export default function ShopMain() {

  // function: 네비게이터 함수 //
  const navigate = useNavigate();

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: 가게 번호 경로 변수 상태 //
  const { storeNumber } = useParams();
  const [store, setStore] = useState<GetStoreResponseDto | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // state: 가게 정보
  const [storeName, setStoreName] = useState<string>('');
  const [storeTel, setStoreTel] = useState<string>('');
  const [storeAddress, setStoreAddress] = useState<string>('');
  const [storeImageUrl, setStoreImageUrl] = useState<File | null>(null);
  const [storeIntroduce, setStoreIntroduce] = useState<string | null>('');
  const [storeParticular, setStoreParticular] = useState<string | null>('');
  const [storeContact, setStoreContact] = useState<string | null>('');
  const [storeCaution, setStoreCaution] = useState<string | null>('');
  const [storeGugun, setStoreGugun] = useState<string>('');
  const [storeDong, setStoreDong] = useState<string>('');
  const [storeLatitude, setStoreLatitude] = useState<string>('');
  const [storeLongtitude, setStoreLongtitude] = useState<string>('');
  const [storeRating, setStoreRating] = useState<number>();
  const [storeDetailAddress, setStoreDetailAddress] = useState<string>('');

  // state: 각 요일별 픽업시간 상태 //
  const [monday, setMonday] = useState({ start: '00:00', end: '00:00' });
  const [tuesday, setTuesday] = useState({ start: '00:00', end: '00:00' });
  const [wednesday, setWednesday] = useState({ start: '00:00', end: '00:00' });
  const [thursday, setThursday] = useState({ start: '00:00', end: '00:00' });
  const [friday, setFriday] = useState({ start: '00:00', end: '00:00' });
  const [saturday, setSaturday] = useState({ start: '00:00', end: '00:00' });
  const [sunday, setSunday] = useState({ start: '00:00', end: '00:00' });

  // function: get store response 처리 함수 //
  const getStoreResponse = (responseBody: GetStoreResponseDto | ResponseDto | null) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다. ' :
        responseBody.code === 'VF' ? '잘못된 접근입니다. ' :
          responseBody.code === 'AF' ? '잘못된 접근입니다. ' :
            responseBody.code === 'NS' ? '존재하지 않는 상점입니다. ' :
              responseBody.code === 'DBE' ? '서버에 문제가 있습니다. ' : ''

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }

    const { storeName, storeIntroduce, storeParticular, storeContact, storeCaution, storeAddress, storeDetailAddress, storeGugun, storeDong, storeLatitude, storeLongtitude, storeRating, storeImageUrl,
      mondayOpen, mondayLast, tuesdayOpen, tuesdayLast, wednesdayOpen, wednesdayLast, thursdayOpen, thursdayLast, fridayOpen, fridayLast, saturdayOpen, saturdayLast, sundayOpen, sundayLast
    } = responseBody as GetStoreResponseDto;
    setStoreName(storeName);
    setPreviewUrl(storeImageUrl);
    setStoreIntroduce(storeIntroduce);
    setStoreParticular(storeParticular);
    setStoreContact(storeContact);
    setStoreCaution(storeCaution);
    setStoreAddress(storeAddress);
    setStoreDetailAddress(storeDetailAddress);
    setStoreGugun(storeGugun);
    setStoreDong(storeDong);
    setStoreLatitude(storeLatitude);
    setStoreLongtitude(storeLongtitude);
    setStoreRating(storeRating);
    setMonday({ start: mondayOpen, end: mondayLast });
    setTuesday({ start: tuesdayOpen, end: tuesdayLast });
    setWednesday({ start: wednesdayOpen, end: wednesdayLast });
    setThursday({ start: thursdayOpen, end: thursdayLast });
    setFriday({ start: fridayOpen, end: fridayLast });
    setSaturday({ start: saturdayOpen, end: saturdayLast });
    setSunday({ start: sundayOpen, end: sundayLast });
    setStore(responseBody as GetStoreResponseDto);
  };


  // effect: 가게 정보 불러오기 함수 //
  useEffect(() => {
    if (!storeNumber) {
      console.log('가게 번호가 없습니다. 등록페이지로 이동합니다.');
      return;
    }

    getStoreRequest(storeNumber).then(getStoreResponse);
  }, [storeNumber])

  return (
    <div id='store-detail-wrapper'>
      <div className='shop-infor'>
        <div className='shop-image' style={{ backgroundImage: `url(${previewUrl})` }}></div>
        <div className='shop-comment'>
          <h2 className='shop-ment'>{storeName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⭐ {storeRating}</h2>
          <h2 className='shop-ment'>{storeGugun}&nbsp;{storeDong}&nbsp;{storeDetailAddress}</h2>
          <h2 className='shop-ment'>매일 11:00 ~ 19:00</h2>
          <h2 className='shop-ment'>{storeIntroduce}</h2>
        </div>
      </div>
      <hr className='hr' />
      <Outlet context={{ store }} />
    </div>

  )
}
