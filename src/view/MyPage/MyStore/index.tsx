import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import { ACCESS_TOKEN, MY_ABSOLUTE_PATH, MY_PATH, MY_STORE_ABSOLUTE_PATH } from '../../../constants';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import { useCookies } from 'react-cookie';
import { PostStoreRequestDto } from '../../../apis/dto/request/store';
import { fileUploadRequest, getStoreRequest, postStoreRequest } from '../../../apis';
import { ResponseDto } from '../../../apis/dto/response';
import { GetStoreResponseDto } from '../../../apis/dto/response/stores';


// Kakao Maps API에서 Geocoder 결과와 상태 타입 정의
interface GeocoderResult {
    address_name: string;
    y: string; // 위도
    x: string; // 경도
}

type GeocoderStatus = 'OK' | 'ZERO_RESULT' | 'ERROR';

declare global {
    interface Window {
        kakao: any;
    }
}

// variable: 기본 이미지 URL //
const defaultProfileImageUrl = 'https://i.ibb.co/7Qg0CTF/ready-To-Image.png';

export default function MyStore() {

    // function: 네비게이터 함수 //
    const navigate = useNavigate();

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: 가게 번호 경로 변수 상태 //
    const { storeNumber } = useParams();

    // state: 가게 정보
    const [userId, setUserId] = useState<string>('qwer1234');
    const [storeName, setStoreName] = useState<string>('기존 가게 이름');
    const [businessNumber, setBusinessNumber] = useState<string>('123-45-67890'); // 수정 불가
    const [storeTel, setStoreTel] = useState<string>('01012345678');
    const [storeAddress, setStoreAddress] = useState<string>('기존 가게 주소');
    const [previewUrl, setPreviewUrl] = useState<string>(defaultProfileImageUrl);
    const [storeImageUrl, setStoreImageUrl] = useState<File | null>(null);
    const [storeIntroduce, setStoreIntroduce] = useState<string | null>('기존 간단한 가게 소개');
    const [storeParticular, setStoreParticular] = useState<string | null>('기존 상세 소개글');
    const [storeContact, setStoreContact] = useState<string | null>('기존 문의 연락처');
    const [storeCaution, setStoreCaution] = useState<string | null>('');
    const [storeGugun, setStoreGugun] = useState<string>('');
    const [storeDong, setStoreDong] = useState<string>('');
    const [storeLatitude, setStoreLatitude] = useState<string>('');
    const [storeLongtitude, setStoreLongtitude] = useState<string>('');

    // state: 등록 파일 상태 //
    const storeUrlInputRef = useRef<HTMLInputElement | null>(null);

    // state: 각 요일별 픽업시간 상태 //
    const [monday, setMonday] = useState({ start: '00:00', end: '00:00' });
    const [tuesday, setTuesday] = useState({ start: '00:00', end: '00:00' });
    const [wednesday, setWednesday] = useState({ start: '00:00', end: '00:00' });
    const [thursday, setThursday] = useState({ start: '00:00', end: '00:00' });
    const [friday, setFriday] = useState({ start: '00:00', end: '00:00' });
    const [saturday, setSaturday] = useState({ start: '00:00', end: '00:00' });
    const [sunday, setSunday] = useState({ start: '00:00', end: '00:00' });

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
        setStoreGugun(getGuFromSigungu(sigungu));
        setStoreDong(bname.endsWith('동') ? bname : bname1);
        console.log(storeGugun);
        console.log(storeDong);

        // Kakao Maps API - Geocoder 사용
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, (result: GeocoderResult[], status: GeocoderStatus) => {
            console.log('카카오 불러오기 성공');
            if (status === window.kakao.maps.services.Status.OK) {
                const { y, x } = result[0]; // y: 위도, x: 경도
                setStoreLatitude(y);
                setStoreLongtitude(x);
                console.log(`위도: ${storeLatitude}, 경도: ${storeLongtitude}`);
            } else {
                console.error('좌표를 불러올 수 없습니다.');
            }
        });
    }

    // function: post store response 처리 함수 //
    const postStoreResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        // if (!storeNumber) return;
        navigate(MY_PATH);
    }

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

        const { userId, storeName, storeIntroduce, storeParticular, storeContact, storeCaution, storeAddress, storeGugun, storeDong, storeLatitude, storeLongtitude,
            mondayOpen, mondayLast, tuesdayOpen, tuesdayLast, wednesdayOpen, wednesdayLast, thursdayOpen, thursdayLast, fridayOpen, fridayLast, saturdayOpen, saturdayLast, sundayOpen, sundayLast
        } = responseBody as GetStoreResponseDto;
        setStoreName(storeName);
        setStoreIntroduce(storeIntroduce);
        setStoreParticular(storeParticular);
        setStoreContact(storeContact);
        setStoreCaution(storeCaution);
        setStoreAddress(storeAddress);
        setStoreGugun(storeGugun);
        setStoreDong(storeDong);
        setStoreLatitude(storeLatitude);
        setStoreLongtitude(storeLongtitude);
        setMonday({ start: mondayOpen, end: mondayLast });
        setTuesday({ start: tuesdayOpen, end: tuesdayLast });
        setWednesday({ start: wednesdayOpen, end: wednesdayLast });
        setThursday({ start: thursdayOpen, end: thursdayLast });
        setFriday({ start: fridayOpen, end: fridayLast });
        setSaturday({ start: saturdayOpen, end: saturdayLast });
        setSunday({ start: sundayOpen, end: sundayLast });
    };


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

    const onStoreImageClickHandler = () => {
        const { current } = storeUrlInputRef;
        if (!current) return;
        current.click();
    };

    // event handler: 대표 이미지 파일 선택 //
    const onStoreUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (!files || !files.length) return;

        const file = files[0];
        setStoreImageUrl(file);

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = () => {
            setPreviewUrl(fileReader.result as string);
        }
        // const file = event.target.files?.[0] || null;
        // if (file) {
        //     setStoreImageUrl(file.name);
        // }
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

    // event handler: 가게 유의사항 변경 이벤트 핸들러 //
    const onStoreCautionChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setStoreCaution(event.target.value);
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

    // event handler: 가게 등록 버튼 클릭 이벤트 처리 //
    const onStoreAddButtonClickHandler = async () => {
        if (!storeName) {
            alert('가게 이름을 작성해주세요 !');
            return;
        }

        if (!storeAddress) {
            alert('가게 주소를 작성해주세요 !');
            return;
        }

        let url: string | null = null;
        if (storeImageUrl) {
            console.log('aaa')
            const formData = new FormData();
            formData.append('file', storeImageUrl);
            url = await fileUploadRequest(formData);
        }
        url = url ? url : previewUrl;

        // if (!storeNumber) {
        //     console.log('가게 번호오류');
        //     return;
        // }
        // const accessToken = cookies[ACCESS_TOKEN];
        // if (!accessToken) {
        //     console.log('토큰 오류');
        //     return;
        // }

        const requestBody: PostStoreRequestDto = {
            userId,
            storeName: storeName,
            storeIntroduce: storeIntroduce,
            storeParticular: storeParticular,
            storeContact: storeContact,
            storeCaution: storeCaution,
            storeAddress: storeAddress,
            storeGugun: storeGugun,
            storeDong: storeDong,
            storeLatitude: storeLatitude,
            storeLongtitude: storeLongtitude,
            storeTel: storeTel,
            storeImageUrl: url,
            mondayOpen: monday.start,
            mondayLast: monday.end,
            tuesdayOpen: tuesday.start,
            tuesdayLast: tuesday.end,
            wednesdayOpen: wednesday.start,
            wednesdayLast: wednesday.end,
            thursdayOpen: thursday.start,
            thursdayLast: thursday.end,
            fridayOpen: friday.start,
            fridayLast: friday.end,
            saturdayOpen: saturday.start,
            saturdayLast: saturday.end,
            sundayOpen: sunday.start,
            sundayLast: sunday.end
        };

        postStoreRequest(requestBody).then(postStoreResponse);
    }

    // event handler: 월요일 시작 시간 변경 핸들러 //
    const handleMondayStartChange = (e: { target: { value: any; }; }) => {
        const startTime = e.target.value;
        setMonday({ ...monday, start: startTime, end: startTime === '휴무일' ? '휴무일' : '' });
    };

    // event handler: 월요일 마감 시간 옵션을 시작 시간 이후로 필터링 //
    const endMondayOptions = monday.start === '휴무일' ? ['휴무일'] : timeOptions.filter(time => time >= monday.start);

    // event handler: 화요일 시작 시간 변경 핸들러 //
    const handleTuesdayStartChange = (e: { target: { value: any; }; }) => {
        const startTime = e.target.value;
        setTuesday({ ...tuesday, start: startTime, end: startTime === '휴무일' ? '휴무일' : '' });
    };

    // event handler: 화요일 마감 시간 옵션을 시작 시간 이후로 필터링 //
    const endTuesdayOptions = tuesday.start === '휴무일' ? ['휴무일'] : timeOptions.filter(time => time >= tuesday.start);

    // event handler: 수요일 시작 시간 변경 핸들러 //
    const handlWednesdayStartChange = (e: { target: { value: any; }; }) => {
        const startTime = e.target.value;
        setWednesday({ ...wednesday, start: startTime, end: startTime === '휴무일' ? '휴무일' : '' });
    };

    // event handler: 수요일 마감 시간 옵션을 시작 시간 이후로 필터링 //
    const endWednesdayOptions = wednesday.start === '휴무일' ? ['휴무일'] : timeOptions.filter(time => time >= wednesday.start);

    // event handler: 목요일 시작 시간 변경 핸들러 //
    const handleThursdayStartChange = (e: { target: { value: any; }; }) => {
        const startTime = e.target.value;
        setThursday({ ...thursday, start: startTime, end: startTime === '휴무일' ? '휴무일' : '' });
    };

    // event handler: 목요일 마감 시간 옵션을 시작 시간 이후로 필터링 //
    const endThursdayOptions = thursday.start === '휴무일' ? ['휴무일'] : timeOptions.filter(time => time >= thursday.start);

    // event handler: 금요일 시작 시간 변경 핸들러 //
    const handleFridayStartChange = (e: { target: { value: any; }; }) => {
        const startTime = e.target.value;
        setFriday({ ...friday, start: startTime, end: startTime === '휴무일' ? '휴무일' : '' });
    };

    // event handler: 금요일 마감 시간 옵션을 시작 시간 이후로 필터링 //
    const endFridayOptions = friday.start === '휴무일' ? ['휴무일'] : timeOptions.filter(time => time >= friday.start);

    // event handler: 토요일 시작 시간 변경 핸들러 //
    const handleSaturdayStartChange = (e: { target: { value: any; }; }) => {
        const startTime = e.target.value;
        setSaturday({ ...saturday, start: startTime, end: startTime === '휴무일' ? '휴무일' : '' });
    };

    // event handler: 토요일 마감 시간 옵션을 시작 시간 이후로 필터링 //
    const endSaturdayOptions = saturday.start === '휴무일' ? ['휴무일'] : timeOptions.filter(time => time >= saturday.start);

    // event handler: 일요일 시작 시간 변경 핸들러 //
    const handleSundayStartChange = (e: { target: { value: any; }; }) => {
        const startTime = e.target.value;
        setSunday({ ...sunday, start: startTime, end: startTime === '휴무일' ? '휴무일' : '' });
    };

    // event handler: 일요일 마감 시간 옵션을 시작 시간 이후로 필터링 //
    const endSundayOptions = sunday.start === '휴무일' ? ['휴무일'] : timeOptions.filter(time => time >= sunday.start);

    // effect: 가게 정보 불러오기 함수 //
    useEffect(() => {
        if (!storeNumber) {
            console.log('가게 번호가 없습니다. 등록페이지로 이동합니다.');
            navigate(MY_STORE_ABSOLUTE_PATH);
            return;
        }
        getStoreRequest(storeNumber).then(getStoreResponse);
    }, [storeNumber])


    // render: 가게 관리 페이지 렌더링 //
    return (
        <div id='my-store'>
            <div className='title'>가게 관리</div>

            <div className='store-manage'>
                <input className='inputs1' placeholder='가게 이름' value={storeName} onChange={onStoreNameChangeHandler} />
                <input className='inputs1' placeholder='가게 연락처' value={storeTel} onChange={onContactNumberChangeHandler} />

                <div className='daum-address'>
                    <input className='register-file' placeholder='가게 주소' value={storeAddress} onChange={onStoreAddressChangeHandler} />
                    <div className='file-button' onClick={onAddressButtonClickHandler}>주소 선택</div>
                </div>

                <div className='file-selection'>

                    <label>대표 이미지 파일 선택</label>
                    <div className='file-box'>
                        {/* <input
                            type="file"
                            ref={storeUrlInputRef}
                            style={{ display: 'none' }} // 숨김 처리
                            accept="image/*" // 이미지 파일 선택 가능
                            onChange={onStoreUrlChange}
                        />
                        <input
                            className='register-file'
                            placeholder='선택된 파일 이름'
                            // value={storeImageUrl}
                            readOnly
                        /> */}
                        <div className='profile-image' style={{ backgroundImage: `url(${previewUrl})` }} onClick={onStoreImageClickHandler}>
                            <input ref={storeUrlInputRef} style={{ display: 'none' }} type='file' accept='image/*' onChange={onStoreUrlChange} />
                        </div>s
                        <div className='file-button' style={{ marginTop: '203px' }} onClick={onStoreImageClickHandler}>파일 선택</div>
                    </div>
                </div>


                <input className='inputs1' placeholder='간단한 가게 소개' value={storeIntroduce || ''} onChange={onStoreSimpleIntroChangeHandler} />
                <input style={{ width: '380px', height: '300px' }} className='detailed-intro' placeholder='상세 소개글' value={storeParticular || ''} onChange={onStoreParticularChangeHandler} />
                <input style={{ width: '380px', height: '300px' }} className='detailed-intro' placeholder='가게 유의사항' value={storeCaution || ''} onChange={onStoreCautionChangeHandler} />


                <input className='inputs1' placeholder='문의 연락처' value={storeContact || ''} onChange={onStoreContactChangeHandler} />

                <div className='pickup-section'>
                    <span className='pickup-title'>픽업 가능 요일</span>
                    <div className='pickup-day'>
                        <span>월요일</span>
                        <span className='time-label'>시작 시간</span>
                        <select value={monday.start} onChange={handleMondayStartChange}>
                            <option>휴무일</option>
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>

                        <span className='time-label'>마감 시간</span>
                        <select
                            value={monday.end}
                            onChange={(e) => setMonday({ ...monday, end: e.target.value })}
                            disabled={monday.start === '휴무일'}
                        >
                            {endMondayOptions.map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                    <div className='pickup-day'>
                        <span>화요일</span>
                        <span className='time-label'>시작 시간</span>
                        <select value={tuesday.start} onChange={handleTuesdayStartChange}>
                            <option>휴무일</option>
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>

                        <span className='time-label'>마감 시간</span>
                        <select
                            value={tuesday.end}
                            onChange={(e) => setTuesday({ ...tuesday, end: e.target.value })}
                            disabled={tuesday.start === '휴무일'}
                        >
                            {endTuesdayOptions.map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                    <div className='pickup-day'>
                        <span>수요일</span>
                        <span className='time-label'>시작 시간</span>
                        <select value={wednesday.start} onChange={handlWednesdayStartChange}>
                            <option>휴무일</option>
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>

                        <span className='time-label'>마감 시간</span>
                        <select
                            value={wednesday.end}
                            onChange={(e) => setWednesday({ ...wednesday, end: e.target.value })}
                            disabled={wednesday.start === '휴무일'}
                        >
                            {endWednesdayOptions.map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                    <div className='pickup-day'>
                        <span>목요일</span>
                        <span className='time-label'>시작 시간</span>
                        <select value={thursday.start} onChange={handleThursdayStartChange}>
                            <option>휴무일</option>
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>

                        <span className='time-label'>마감 시간</span>
                        <select
                            value={thursday.end}
                            onChange={(e) => setThursday({ ...thursday, end: e.target.value })}
                            disabled={thursday.start === '휴무일'}
                        >
                            {endThursdayOptions.map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                    <div className='pickup-day'>
                        <span>금요일</span>
                        <span className='time-label'>시작 시간</span>
                        <select value={friday.start} onChange={handleFridayStartChange}>
                            <option>휴무일</option>
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>

                        <span className='time-label'>마감 시간</span>
                        <select
                            value={friday.end}
                            onChange={(e) => setFriday({ ...friday, end: e.target.value })}
                            disabled={friday.start === '휴무일'}
                        >
                            {endFridayOptions.map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                    <div className='pickup-day'>
                        <span>토요일</span>
                        <span className='time-label'>시작 시간</span>
                        <select value={saturday.start} onChange={handleSaturdayStartChange}>
                            <option>휴무일</option>
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>

                        <span className='time-label'>마감 시간</span>
                        <select
                            value={saturday.end}
                            onChange={(e) => setSaturday({ ...saturday, end: e.target.value })}
                            disabled={saturday.start === '휴무일'}
                        >
                            {endSaturdayOptions.map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                    <div className='pickup-day'>
                        <span>일요일</span>
                        <span className='time-label'>시작 시간</span>
                        <select value={sunday.start} onChange={handleSundayStartChange}>
                            <option>휴무일</option>
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>

                        <span className='time-label'>마감 시간</span>
                        <select
                            value={sunday.end}
                            onChange={(e) => setSunday({ ...sunday, end: e.target.value })}
                            disabled={sunday.start === '휴무일'}
                        >
                            {endSundayOptions.map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className='button-container'>
                <div className='cancel-button' onClick={onCancelClickHandler}>취소</div>
                <div className='update-button' onClick={onStoreAddButtonClickHandler}>수정</div>
            </div>
        </div >
    );
}