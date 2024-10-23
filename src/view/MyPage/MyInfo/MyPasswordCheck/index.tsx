import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

export default function MyPasswordCheck() {
    // state: 비밀번호 상태 및 메시지 상태
    const [password, setPassword] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [isMatched, setIsMatched] = useState<boolean>(false);

    // 네비게이터 함수 //
    const navigate = useNavigate();

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
        if (isMatched) {
            navigate('../'); // 개인 정보 수정 페이지로 이동
        } else {
            alert('비밀번호를 확인해주세요.');
        }
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
