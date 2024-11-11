import React, { useEffect, useState } from 'react'
import './style.css';
import { getStoreRequest } from '../../apis';
import { Outlet, useNavigate, useParams } from 'react-router';
import { GetStoreResponseDto } from '../../apis/dto/response/stores';
import { ResponseDto } from '../../apis/dto/response';
import { useCookies } from 'react-cookie';
import { Tooltip, tooltipClasses, Zoom } from '@mui/material';


export default function ShopMain() {

  // function: 네비게이터 함수 //
  const navigate = useNavigate();

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: 가게 번호 경로 변수 상태 //
  const { storeNumber} = useParams();
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
    console.log("스토어 넘버: " + storeNumber);

    getStoreRequest(storeNumber).then(getStoreResponse);
  }, [storeNumber])

  return (
    <div id='store-detail-wrapper'>
      <div className='shop-infor'>
        <div className='shop-image' style={{ backgroundImage: `url(${previewUrl})` }}></div>
        <div className='shop-comment'>
          <div>
          <span className='shop-ment-name'>{storeName}</span>
          <span className='shop-ment-rating'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⭐ {storeRating}</span>
          <h2 className='shop-ment'>{storeGugun}&nbsp;{storeDong}&nbsp;{storeDetailAddress}</h2>
          <h2 className='shop-ment-day'>
            {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => {
              const dayState = [monday, tuesday, wednesday, thursday, friday, saturday, sunday][index];
              const isClosed = dayState.start === '휴무일' || dayState.end === '휴무일';
              return (
                <Tooltip TransitionComponent={Zoom} title={isClosed ? '휴무일' : `${dayState.start} ~ ${dayState.end}`} arrow
                  slotProps={{
                    popper: {
                      sx: {
                        [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                        {
                          marginTop: '3px',
                        },
                        [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                        {
                          marginBottom: '0px',
                        },
                        [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                        {
                          marginLeft: '0px',
                        },
                        [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
                        {
                          marginRight: '0px',
                        },
                      },
                    },
                  }}>
                  <div
                    key={day}
                    className={isClosed ? 'closed-day' : 'open-day'}>
                    {day}
                  </div>
                </Tooltip>
              );
            })}
          </h2>
          <div className='shop-ment-intoroduce'>"{storeIntroduce}"</div>
          </div>
        </div>
      </div>
      <hr className='hr' />
      <Outlet context={{ store }} />
    </div >

  )
}
