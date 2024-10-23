import React, { ChangeEvent, useRef, useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { MY_PATH } from '../../../constants';

export default function MyStore() {
    const navigate = useNavigate();

    // state: 가게 정보
    const [storeName, setStoreName] = useState<string>('기존 가게 이름');
    const [businessNumber, setBusinessNumber] = useState<string>('123-45-67890'); // 수정 불가
    const [contactNumber, setContactNumber] = useState<string>('01012345678');
    const [storeAddress, setStoreAddress] = useState<string>('기존 가게 주소');
    const [businessUrl, setBusinessUrl] = useState<string>('기존 선택 파일');
    const [storeUrl, setStoreUrl] = useState<string>('기존 선택 파일');
    const [storeSimpleIntro, setStoreSimpleIntro] = useState<string>('기존 간단한 가게 소개');
    const [storeParticular, setStoreParticular] = useState<string>('기존 상세 소개글');
    const [storeContact, setStoreContact] = useState<string>('기존 문의 연락처');

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

    // 시간 선택 옵션
    const timeOptions = Array.from({ length: 49 }, (_, i) => {
        const hour = String(Math.floor(i / 2)).padStart(2, '0');
        const minute = i % 2 === 0 ? '00' : '30';
        return `${hour}:${minute}`;
    });

    // event handler: 가게 이름 변경 이벤트 핸들러 //
    const onStoreNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setStoreName(event.target.value);
    };

    // event handler: 가게 연락처 변경 이벤트 핸들러 //
    const onContactNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setContactNumber(event.target.value);
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
            setStoreUrl(file.name);
        }
    };

    // event handler: 간단한 가게 소개 변경 이벤트 핸들러 //
    const onStoreSimpleIntroChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setStoreSimpleIntro(event.target.value);
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

    // render: 가게 관리 페이지 렌더링 //
    return (
        <div id='my-store'>
            <div className='title'>가게 관리</div>

            <div className='store-manage'>
                <input className='inputs1' placeholder='가게 이름' value={storeName} onChange={onStoreNameChangeHandler} />
                <input className='inputs1' placeholder='사업자 등록 번호' value={businessNumber} readOnly />
                <input className='inputs1' placeholder='가게 연락처' value={contactNumber} onChange={onContactNumberChangeHandler} />
                <input className='inputs1' placeholder='가게 주소' value={storeAddress} onChange={onStoreAddressChangeHandler} />

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
                            value={storeUrl}
                            readOnly
                        />
                        <div className='file-button' onClick={onUploadStoreUrlClickHandler}>파일 선택</div>
                    </div>
                </div>


                <input className='inputs1' placeholder='간단한 가게 소개' value={storeSimpleIntro} onChange={onStoreSimpleIntroChangeHandler} />
                <input style={{ width: '380px', height: '300px' }}  className='detailed-intro' placeholder='상세 소개글' value={storeParticular} onChange={onStoreParticularChangeHandler} />

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
