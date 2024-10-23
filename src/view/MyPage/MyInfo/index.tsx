import React, { ChangeEvent, useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { MY_PATH } from '../../../constants';

export default function InfoUpdate() {

    const navigate = useNavigate();

    // state: 기존 정보로 초기화 //
    const [name, setName] = useState<string>('기존 이름');
    const [password, setPassword] = useState<string>('');
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    const [birth, setBirth] = useState<string>('YYYYMMDD');
    const [gender, setGender] = useState<string>('여');
    const [telNumber, setTelNumber] = useState<string>('01012345678');
    const [authNumber, setAuthNumber] = useState<string>('');

    const [telMessage, setTelMessage] = useState<string>('');
    const [authMessage, setAuthMessage] = useState<string>('');

    // state: 메시지 상태 //
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [isPwMatched, setIsPwMatched] = useState<boolean>(false);
    const [birthMessage, setBirthMessage] = useState<string>('');
    const [birthMsgBool, setBirthMsgBool] = useState<boolean>(false);
    const [isMatched1, setIsMatched1] = useState<boolean>(false);
    const [isMatched2, setIsMatched2] = useState<boolean>(false);

    // event handler: 이름 변경 이벤트 핸들러 //
    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setName(value);
    }

    // event handler: 비밀번호 변경 이벤트 핸들러 //
    const passwordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPassword(value);

        const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
        const isTrue = pattern.test(value);
        setIsPwMatched(isTrue);

        if (!isTrue) setPasswordMessage('영문, 숫자를 혼용하여 8~13자 입력해주세요.');
        else setPasswordMessage('');
    }

    // event handler: 비밀번호 확인 변경 이벤트 핸들러 //
    const onPwCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPasswordCheck(value);
        setIsPwMatched(password === value);
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

    // event handler: 전화번호 변경 이벤트 핸들러 //
    const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setTelNumber(value);
    }

    // event handler: 전화번호 인증번호 변경 이벤트 핸들러 //
    const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setAuthNumber(value);
    }

    // event handler: 전송 버튼 클릭 이벤트 핸들러 //
    const onSendClickHandler = () => {
        if (!telNumber) {
            setTelMessage('');
            return;
        }

        const pattern = /^[0-9]{11}$/;
        const isTrue = pattern.test(telNumber);
        setIsMatched1(isTrue);
        if (isTrue) setTelMessage('인증번호가 전송되었습니다.');
        else setTelMessage('전화번호 11자 입력해주세요.');
    }

    // event handler: 인증 번호 확인 버튼 클릭 이벤트 핸들러 //
    const onCheckClickHandler = () => {
        if (!authNumber) return;

        const isTrue = true; // 실제 인증 로직 추가 필요
        setIsMatched2(isTrue);
        if (isTrue) setAuthMessage('인증번호가 일치합니다.');
        else setAuthMessage('인증번호가 일치하지 않습니다.');
    }

    // event handler: 취소 버튼 클릭 이벤트 핸들러 //
    const onCancelClickHandler = () => {
        navigate(MY_PATH);
    }

    // event handler: 수정 버튼 클릭 이벤트 핸들러 //
    const onEditClickHandler = () => {
        // 수정할 로직 추가
        if (isMatched1 && isMatched2 && isPwMatched && birthMsgBool) {
            alert('정보가 수정되었습니다.');
            navigate(MY_PATH);
        } else {
            alert('정확하게 입력해주세요.');
        }
    }

    // render: 개인 정보 수정 페이지 렌더링 //
    return (
        <div id='info-update' style={{ width: "450px" }}>
            <div className='title'>개인 정보 수정</div>

            <div className='update-box'>
                <input className='inputs1' placeholder='이름' value={name} onChange={onNameChangeHandler} />
                <input className='inputs1' placeholder='비밀번호' type='password' value={password} onChange={passwordChangeHandler} />
                <div className='message-false'>{passwordMessage}</div>
                <input className='inputs1' placeholder='비밀번호 확인' type='password' value={passwordCheck} onChange={onPwCheckChangeHandler} />
                <div className='message-false'>{!isPwMatched ? '비밀번호가 일치하지 않습니다.' : ''}</div>

                <input className='inputs1' placeholder='생년월일(YYYYMMDD)' value={birth} onChange={onBirthChangeHandler} maxLength={8} />
                <div className='message-false'>{birthMessage}</div>

                <div className='gender-box'>
                    <div onClick={() => onGenderClickHandler('여')} className={gender === '여' ? 'selected' : 'unselected'}>여성</div>
                    <div onClick={() => onGenderClickHandler('남')} className={gender === '남' ? 'selected' : 'unselected'}>남성</div>
                </div>

                <div className='tel-number-box'>
                    <input className='inputs2' placeholder='전화번호' value={telNumber} onChange={onTelNumberChangeHandler} />
                    <div className='send-button' onClick={onSendClickHandler}>전화번호 인증</div>
                </div>
                <div className='message-false'>{telMessage}</div>

                {isMatched1 && 
                <>
                    <div className='tel-auth-box'>
                        <input className='inputs2' placeholder='인증번호 4자리' value={authNumber} onChange={onAuthNumberChangeHandler} />
                        <div className='send-button' onClick={onCheckClickHandler}>인증 확인</div>
                    </div>
                    <div className='message-false'>{isMatched2 ? '인증번호가 일치합니다.' : '인증번호가 일치하지 않습니다.'}</div>
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
