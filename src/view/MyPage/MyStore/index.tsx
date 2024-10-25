import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { MY_PATH } from '../../../constants';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';


// // Kakao Maps API에서 Geocoder 결과와 상태 타입 정의
// interface GeocoderResult {
//     address_name: string;
//     y: string; // 위도
//     x: string; // 경도
// }

// type GeocoderStatus = 'OK' | 'ZERO_RESULT' | 'ERROR';

// declare global {
//     interface Window {
//         kakao: any;
//     }
// }

export default function MyStore() {
    const navigate = useNavigate();

    // state: 가게 정보
    const [storeName, setStoreName] = useState<string>('기존 가게 이름');
    const [businessNumber, setBusinessNumber] = useState<string>('123-45-67890'); // 수정 불가
    const [storeTel, setStoreTel] = useState<string>('01012345678');
    const [storeAddress, setStoreAddress] = useState<string>('기존 가게 주소');
    const [businessUrl, setBusinessUrl] = useState<string>('기존 선택 파일');
    const [storeImageUrl, setStoreImageUrl] = useState<string>('기존 선택 파일');
    const [storeIntroduce, setStoreIntroduce] = useState<string>('기존 간단한 가게 소개');
    const [storeParticular, setStoreParticular] = useState<string>('기존 상세 소개글');
    const [storeContact, setStoreContact] = useState<string>('기존 문의 연락처');
    const [storeGuGun, setStoreGuGun] = useState<String>('');
    const [storeDong, setStoreDong] = useState<String>('');
    const [latitude, setLatitude] = useState<String>('');
    const [longitude, setLongitude] = useState<String>('');

    // state: 사업자 등록 파일 상태 //
    const businessUrlInputRef = useRef<HTMLInputElement | null>(null);
    const storeUrlInputRef = useRef<HTMLInputElement | null>(null);

    // state: 픽업 가능 요일 및 시간
    const [pickupDays, setPickupDays] = useState<Array<{ day: string; start: string; end: string }>>([
        { day: '월요일', start: '휴무일', end: '휴무일' },
        { day: '화요일', start: '휴무일', end: '휴무일' },
        { day: '수요일', start: '휴무일', end: '휴무일' },
        { day: '목요일', start: '휴무일', end: '휴무일' },
        { day: '금요일', start: '휴무일', end: '휴무일' },
        { day: '토요일', start: '휴무일', end: '휴무일' },
        { day: '일요일', start: '휴무일', end: '휴무일' },
    ]);

    // function: 시간 선택 옵션 //
    const timeOptions = Array.from({ length: 49 }, (_, i) => {
        const hour = String(Math.floor(i / 2)).padStart(2, '0');
        const minute = i % 2 === 0 ? '00' : '30';
        return `${hour}:${minute}`;
    });

    // function: 다음 주소 검색 팝업 함수 //
    const daumPostcodePopup = useDaumPostcodePopup();

    // function: 다음 주소 검색 완료 처리 함수 //
    const daumPostcodeComplete = (result: Address) => {
        const { address, bname, sigungu, bname1 } = result;

        const getGuFromSigungu = (sigungu: string) => {
            const parts = sigungu.split(' ');
            const guPart = parts.find(part => part.endsWith('구') || part.endsWith('군')) || ""; // '구'로 끝나는 부분만 추출
            return guPart;
        };

        setStoreAddress(address);
        setStoreGuGun(getGuFromSigungu(sigungu));
        setStoreDong(bname.endsWith('동') ? bname : bname1);
        console.log(storeGuGun);
        console.log(storeDong);

        // // Kakao Maps API - Geocoder 사용
        // const geocoder = new window.kakao.maps.services.Geocoder();
        // geocoder.addressSearch(address, (result: GeocoderResult[], status: GeocoderStatus) => {
        //     if (status === window.kakao.maps.services.Status.OK) {
        //         const { y, x } = result[0]; // y: 위도, x: 경도
        //         setLatitude(y);
        //         setLongitude(x);
        //         console.log(`위도: ${y}, 경도: ${x}`);
        //     } else {
        //         console.error('좌표를 불러올 수 없습니다.');
        //     }
        // });

    }

    // event handler: 가게 이름 변경 이벤트 핸들러 //
    const onStoreNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setStoreName(event.target.value);
    };

    // event handler: 가게 연락처 변경 이벤트 핸들러 //
    const onContactNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setStoreTel(event.target.value);
    };

    // event handler: 주소 변경 이벤트 핸들러 //
    const onStoreAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setStoreAddress(event.target.value);
    };


    // event handler: 파일 선택 버튼 클릭 이벤트 핸들러 //
    const onUploadBusinessUrlClickHandler = () => {
        const { current } = businessUrlInputRef;
        if (!current) return;
        current.click();
    };

    const onUploadStoreUrlClickHandler = () => {
        const { current } = storeUrlInputRef;
        if (!current) return;
        current.click();
    };

    // event handler: 파일 선택 시 파일 이름 설정 //
    const onBusinessUrlChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setBusinessUrl(file.name);
        }
    };

    // event handler: 대표 이미지 파일 선택 //
    const onStoreUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            setStoreImageUrl(file.name);
        }
    };

    // event handler: 간단한 가게 소개 변경 이벤트 핸들러 //
    const onStoreSimpleIntroChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setStoreIntroduce(event.target.value);
    };

    // event handler: 상세 소개글 변경 이벤트 핸들러 //
    const onStoreParticularChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setStoreParticular(event.target.value);
    };

    // event handler: 문의 연락처 변경 이벤트 핸들러 //
    const onStoreContactChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setStoreContact(event.target.value);
    };

    // event handler: 픽업 요일 및 시간 변경 이벤트 핸들러 //
    const onPickupTimeChange = (day: string, field: 'start' | 'end', time: string) => {
        setPickupDays(prevDays => prevDays.map(pd =>
            pd.day === day ? { ...pd, [field]: time } : pd
        ));
    };

    // event handler: 취소 버튼 클릭 이벤트 핸들러 //
    const onCancelClickHandler = () => {
        navigate(MY_PATH);
    };

    // event handler: 수정 버튼 클릭 이벤트 핸들러 //
    const onUpdateClickHandler = () => {
        // 수정 로직 추가
        alert('정보가 수정되었습니다.');
        navigate(MY_PATH);
    };

    // event handler: 주소 검색 버튼 클릭 이벤트 처리 //
    const onAddressButtonClickHandler = () => {
        daumPostcodePopup({ onComplete: daumPostcodeComplete });
    };

    // render: 가게 관리 페이지 렌더링 //
    return (
        <div id='my-store'>
            <div className='title'>가게 관리</div>

            <div className='store-manage'>
                <input className='inputs1' placeholder='가게 이름' value={storeName} onChange={onStoreNameChangeHandler} />
                <input className='inputs1' placeholder='사업자 등록 번호' value={businessNumber} readOnly />
                <input className='inputs1' placeholder='가게 연락처' value={storeTel} onChange={onContactNumberChangeHandler} />

                <div className='daum-address'>
                    <input className='register-file' placeholder='가게 주소' value={storeAddress} onChange={onStoreAddressChangeHandler} />
                    <div className='file-button' onClick={onAddressButtonClickHandler}>주소 선택</div>
                </div>



                <div className='file-selection'>
                    <label>사업자 등록증 파일 선택</label>
                    <div className='file-box'>
                        <input
                            type="file"
                            ref={businessUrlInputRef}
                            style={{ display: 'none' }}
                            accept="application/pdf"
                            onChange={onBusinessUrlChangeHandler}
                        />
                        <input
                            className='register-file'
                            placeholder='선택된 파일 이름'
                            value={businessUrl}
                            readOnly
                        />
                        <div className='file-button' onClick={onUploadBusinessUrlClickHandler}>파일 선택</div>
                    </div>

                    <label>대표 이미지 파일 선택</label>
                    <div className='file-box'>
                        <input
                            type="file"
                            ref={storeUrlInputRef}
                            style={{ display: 'none' }} // 숨김 처리
                            accept="image/*" // 이미지 파일 선택 가능
                            onChange={onStoreUrlChange}
                        />
                        <input
                            className='register-file'
                            placeholder='선택된 파일 이름'
                            value={storeImageUrl}
                            readOnly
                        />
                        <div className='file-button' onClick={onUploadStoreUrlClickHandler}>파일 선택</div>
                    </div>
                </div>


                <input className='inputs1' placeholder='간단한 가게 소개' value={storeIntroduce} onChange={onStoreSimpleIntroChangeHandler} />
                <input style={{ width: '380px', height: '300px' }} className='detailed-intro' placeholder='상세 소개글' value={storeParticular} onChange={onStoreParticularChangeHandler} />

                <input className='inputs1' placeholder='문의 연락처' value={storeContact} onChange={onStoreContactChangeHandler} />

                <div className='pickup-section'>
                    <span className='pickup-title'>픽업 가능 요일</span>
                    {pickupDays.map(day => (
                        <div key={day.day} className='pickup-day'>
                            <span>{day.day}</span>
                            <span className='time-label'>시작 시간</span>
                            <select value={day.start} onChange={(e) => onPickupTimeChange(day.day, 'start', e.target.value)}>
                                {timeOptions.map(time => <option key={time} value={time}>{time}</option>)}
                            </select>
                            <span className='time-label'>마감 시간</span>
                            <select value={day.end} onChange={(e) => onPickupTimeChange(day.day, 'end', e.target.value)}>
                                {timeOptions.map(time => <option key={time} value={time}>{time}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            <div className='button-container'>
                <div className='cancel-button' onClick={onCancelClickHandler}>취소</div>
                <div className='update-button' onClick={onUpdateClickHandler}>수정</div>
            </div>
        </div>
    );
}