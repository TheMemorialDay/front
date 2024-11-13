import React, { ChangeEvent, useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, MY_PATH } from '../../../constants';
import useUserInfoZustand from '../../../stores/user-check-after-info.store';
import { ResponseDto } from '../../../apis/dto/response';
import { TelAuthCheckRequestDto, TelAuthRequestDto } from '../../../apis/dto/request/auth';
import { patchUserInfoRequest, userInfoTelAuthCheckRequest, userInfoTelAuthReqeust } from '../../../apis';
import { PatchUserInfoRequestDto } from '../../../apis/dto/request/mypage_user_info';
import { useCookies } from 'react-cookie';

// component: 마이페이지 유저 정보 수정 컴포넌트 //
export default function InfoUpdate() {
    
    // state: 메시지 상태 //
    const [telMessage, setTelMessage] = useState<string>('');
    const [authMessage, setAuthMessage] = useState<string>('');
    const [birthMessage, setBirthMessage] = useState<string>('');
    const [isMatched1, setIsMatched1] = useState<boolean>(false);
    const [isMatched2, setIsMatched2] = useState<boolean>(false);
    
    // state: 메시지 에러 상태 //
    const [birthMsgBool, setBirthMsgBool] = useState<boolean>(false);
    const [telNumberMessageError, setTelNumberMessageError] = useState<boolean>(false);
    const [telAuthCheckMessageError, setTelAuthCheckMessageError] = useState<boolean>(false);

    // state: 검증 상태 //
    const [isSend, setSend] = useState<boolean>(false);
    const [isCheckedAuthNumber, setCheckedAuthNumber] = useState<boolean>(false);

    // state: zustand 가져오기 //
    const { userId, name, birth, gender, telNumber, telAuthNumber,
        setUserId, setName, setBirth, setGender, setTelNumber, setTelAuthNumber } 
        = useUserInfoZustand();

    // state: cookie //
    const [cookies] = useCookies();

    // state: 전화번호 변경 유무 상태 //
    const [telUpdate, setTelUpdate] = useState<boolean>(false);

    // state: 새로 입력할 전화번호 상태 //
    const [newTelNumber, setNewTelNumber] = useState<string>('');

    // variable: 회원 수정 가능 상태 확인 //
    const isPossibleNoAuth = name && birth && gender && telNumber;
    const isPossibleYesAuth = name && birth && gender && telNumber && newTelNumber;

    // variable: 토큰 //
    const accessToken = cookies[ACCESS_TOKEN];

    // function: 네비게이터 //
    const navigator = useNavigate();

    // function: 전화번호 인증 Response 처리 함수 //
    const telAuthResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '숫자 11자를 입력해주세요.' :
            responseBody.code === 'DT' ? '중복된 전화번호입니다.' :
            responseBody.code === 'TF' ? '전송에 실패했습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'SU' ? '인증번호가 전송되었습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';

        if (!accessToken) return;

        setTelMessage(message);
        setIsMatched1(isSuccessed);
        setTelNumberMessageError(!isSuccessed);
        setSend(isSuccessed);
    };

    // function: 전화번호 & 인증번호 인증 Response 처리 함수 //
    const telAuthCheckResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' :
            responseBody.code === 'TAF' ? '인증번호가 일치하지 않습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'SU' ? '인증번호가 확인되었습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';

        if (!accessToken) return;

        setAuthMessage(message);
        setTelAuthCheckMessageError(!isSuccessed);
        setCheckedAuthNumber(isSuccessed);
        setIsMatched2(isSuccessed);
    };

    // function: 회원정보 수정 완료 Response 처리 함수 //
    const userUpdateCompletedResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '입력값을 확인해주세요.' :
            responseBody.code === 'NU' ? '존재하지 않는 정보입니다.' :
            responseBody.code === 'AF' ? '인증에 실패했습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';

        if (!isSuccessed) {
            alert(message);
            return;
        }

        if (!accessToken) return;

        alert('수정이 완료되었습니다.');
        navigator(MY_PATH);
    };

    // Function: 전화번호 '-'넣는 함수 //
    const displayFormattedPhoneNumber = (numbers: string) => {
        if (numbers.length <= 3) {
            return numbers;
        } else if (numbers.length <= 7) {
            return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        } else {
            return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
                7
            )}`;
        }
    };

    // event handler: 새로 입력하는 전화번호 상태 변경 핸들러 //
    const onNewTelNumberHandler = (event: ChangeEvent<HTMLInputElement>) => {
        // const { value } = event.target;
        // setNewTelNumber(value);
        const numbersOnly = event.target.value.replace(/\D/g, "");
        if (numbersOnly.length <= 11) {
            setNewTelNumber(numbersOnly);
        }
    };

    // event handler: 이름 변경 이벤트 핸들러 //
    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setName(value);
    }

    // event handler: 생년월일 변경 이벤트 핸들러 //
    const onBirthChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setBirth(value);

        if (value.length === 8) {
            const year = parseInt(value.substring(0, 4), 10);
            const month = parseInt(value.substring(4, 6), 10) - 1;
            const day = parseInt(value.substring(6, 8), 10);
            const inputDate = new Date(year, month, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (inputDate > today) {
                setBirthMessage('일치하지 않는 형식입니다.');
                setBirthMsgBool(false);
            } else {
                setBirthMessage('');
                setBirthMsgBool(true);
            }
        } else if (value.length === 0) {
            setBirthMessage('');
            setBirthMsgBool(false);
        } else {
            setBirthMessage('일치하지 않는 형식입니다.');
            setBirthMsgBool(false);
        }
    }

    // event handler: 성별 선택 이벤트 핸들러 //
    const onGenderClickHandler = (gender: string) => {
        setGender(gender);
    }

    // event handler: 전화번호 인증번호 변경 이벤트 핸들러 //
    const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setTelAuthNumber(value);
    }

    // event handler: 전화번호 인증 확인 / 인증번호 전송 버튼 클릭 이벤트 핸들러 //
    const onSendClickHandler = () => {
        if (telNumber === newTelNumber) {
            setTelMessage('중복된 전화번호입니다.');
            return;
        }

        const pattern = /^[0-9]{11}$/;
        const isTrue = pattern.test(newTelNumber);
        console.log("istrue:" + isTrue);

        if (isTrue && telNumber !== newTelNumber) {
            setTelMessage('');
            const requestBody: TelAuthRequestDto = { telNumber: newTelNumber };
            userInfoTelAuthReqeust(requestBody, accessToken).then(telAuthResponse);
        } else {
            setTelMessage('숫자 11자로 입력해주세요.');
            setTelNumberMessageError(true);
            return;
        }
    }

    // event handler: 전화번호 변경할려고 할 때 전화번호 인증창 오픈할 이벤트 핸들러 //
    const onOpenTelUpdateInputClickHandler = () => {
        setTelUpdate(true);
    };

    // event handler: 인증 번호 확인 버튼 클릭 이벤트 핸들러 //
    const onCheckClickHandler = () => {
        if (!telAuthNumber) return;

        const requestBody: TelAuthCheckRequestDto = { telNumber: newTelNumber, telAuthNumber: telAuthNumber };
        userInfoTelAuthCheckRequest(requestBody, accessToken).then(telAuthCheckResponse);
    }

    // event handler: 취소 버튼 클릭 이벤트 핸들러 //
    const onCancelClickHandler = () => {
        navigator(MY_PATH);
    }

    // event handler: 최종 / 수정 버튼 클릭 이벤트 핸들러 //
    const onEditClickHandler = () => {
        if((!telUpdate && !isPossibleNoAuth) || (telUpdate && !isPossibleYesAuth)) {
            alert('정확하게 입력해주세요.');
            return;
        }
        const requestBody: PatchUserInfoRequestDto = {
            name,
            gender,
            birth,
            telNumber: telUpdate ? newTelNumber : telNumber
        };

        patchUserInfoRequest(requestBody, accessToken).then(userUpdateCompletedResponse);
    }

    // render: 마이페이지 개인 정보 수정 페이지 렌더링 //
    return (
        <div id='info-update' style={{ width: "450px" }}>
            <div className='title'>개인 정보 수정</div>

            <div className='update-box'>
                <input className='inputs1' placeholder='이름' value={name} onChange={onNameChangeHandler} />

                <input className='inputs1' placeholder='생년월일(YYYYMMDD)' value={birth} onChange={onBirthChangeHandler} maxLength={8} />
                <div className={`message ${birth ? 'false' : 'true'}`}>{birthMessage}</div>

                <div className='gender-box'>
                    <div onClick={() => onGenderClickHandler('여')} className={gender === '여' ? 'selected' : 'unselected'}>여성</div>
                    <div onClick={() => onGenderClickHandler('남')} className={gender === '남' ? 'selected' : 'unselected'}>남성</div>
                </div>

                <div className='tel-number-box'>
                    <input className='inputs2' placeholder='전화번호' value={displayFormattedPhoneNumber(telNumber)} disabled />
                    <div className='change-button' onClick={onOpenTelUpdateInputClickHandler}>전화번호 변경</div>
                    
                </div>

                {telUpdate &&
                    <>
                        <div className='tel-number-update-box'>
                            <input className='inputs3' placeholder='변경할 전화번호' value={displayFormattedPhoneNumber(newTelNumber)} onChange={onNewTelNumberHandler} />
                            <div className='update-send-button' onClick={onSendClickHandler}>전화번호 인증</div>
                        </div>
                        <div className={`message ${isMatched1 ? 'true' : 'false'}`}>{telMessage}</div>
                    </>
                }

                {isMatched1 && 
                <>
                    <div className='tel-auth-box'>
                        <input className='inputs2' placeholder='인증번호 4자리' value={telAuthNumber} onChange={onAuthNumberChangeHandler} />
                        <div className='send-button' onClick={onCheckClickHandler}>인증 확인</div>
                    </div>
                    <div className={`message ${isMatched2 ? 'true' : 'false'}`}>{authMessage}</div>
                </>
                }

            </div>
                <div className='button-container'>
                    <div className='withdraw-button' onClick={() => alert('탈퇴 기능은 아직 구현되지 않았습니다')}>탈퇴</div>
                <div className='cancel-update-button'>
                    <div className='cancel-button' onClick={onCancelClickHandler}>취소</div>
                    <div className='update-button' onClick={onEditClickHandler}>수정</div>
                </div>
            </div>
        </div>
    );
}
