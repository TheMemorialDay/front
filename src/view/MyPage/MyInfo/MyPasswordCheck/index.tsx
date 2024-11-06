import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { useCookies } from 'react-cookie';
import { PasswordCheckOfUserUpdateResponseDto } from '../../../../apis/dto/response/auth';
import { ResponseDto } from '../../../../apis/dto/response';
import { passwordCheckOfUserUpdateRequest } from '../../../../apis';
import { PasswordCheckOfUserUpdateRequestDto } from '../../../../apis/dto/request/mypage_user_info';
import { GetUserInfosResponseDto } from '../../../../apis/dto/response/mypage_user_info';
import useUserInfoZustand from '../../../../stores/user-check-after-info.store';
import { ACCESS_TOKEN, MY_INFO_ABSOLUTE_PATH } from '../../../../constants';

export default function MyPasswordCheck() {
    // state: 비밀번호 상태 및 메시지 상태
    // const [password, setPassword] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [isMatched, setIsMatched] = useState<boolean>(false);

    // state: 아이디 상태 //
    const [userId, setUserId] = useState<string>('');

    // state: 쿠키 상태 //
    const [ cookies, setCookie ] = useCookies();

    // state: zustand 불러오기 //
    const { password, name, birth, gender, telNumber, 
        setPassword, setName, setBirth, setGender, setTelNumber } 
        = useUserInfoZustand();

    // variable: access token //
    const accessToken = cookies[ACCESS_TOKEN];

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: 개인 정보 수정 Response 처리 함수 //
    const userUpdateResponse = (responseBody: PasswordCheckOfUserUpdateResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '일치하는 정보가 없습니다.' :
            responseBody.code === 'AF' ? '일치하는 정보가 없습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'SU' ? '인증에 성공했습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';

        if (!isSuccessed) {
            setPasswordMessage(message);
            setIsMatched(isSuccessed);
            alert('잘못된 정보입니다.');
            return;
        }

        if (!accessToken) return;

        const userInfo = responseBody as GetUserInfosResponseDto;
        setPassword(userInfo.name);
        setName(userInfo.name);
        setBirth(userInfo.birth);
        setGender(userInfo.gender);
        setTelNumber(userInfo.telNumber);

        navigator(MY_INFO_ABSOLUTE_PATH);
    };

    // event handler: 비밀번호 변경 이벤트 핸들러 //
    const onChangePasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPassword(value);

        const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
        const isTrue = pattern.test(value);
        setIsMatched(isTrue);

        if (!isTrue) {
            setPasswordMessage('영문, 숫자를 혼용하여 8~13자 입력해주세요.');
        } else {
            setPasswordMessage('');
        }
    };

    // event handler: 개인 정보 수정 버튼 클릭 이벤트 핸들러 //
    const onEditInfoClickHandler = () => {
        if (!password) return;

        const requestBody: PasswordCheckOfUserUpdateRequestDto = { password };
        passwordCheckOfUserUpdateRequest(requestBody, accessToken).then(userUpdateResponse);
    };

    // render: 본인 확인 페이지 렌더링 //
    return (
        <div id='check-info'>
            <div className='title'>본인 확인</div>
            <div className='password-box'>
                <input
                    type='password'
                    className='input-password'
                    placeholder='비밀번호(영문+숫자 8~13자)'
                    value={password}
                    onChange={onChangePasswordHandler}
                />
                <div className={isMatched ? 'message-true' : 'message-false'}>
                    {passwordMessage}
                </div>
            </div>
            <div className='update-button' onClick={onEditInfoClickHandler}>
                개인 정보 수정
            </div>
        </div>
    );
}
