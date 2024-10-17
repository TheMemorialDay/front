import React, { ChangeEvent, useState } from 'react'
import './style.css';
import { useNavigate } from 'react-router-dom';
import { LOGIN_PATH, ROOT_ABSOLUTE_PATH } from '../../../constants';

// component: 회원가입 화면 컴포넌트 //
export default function SignUp() {

    // state: 기타 관련 변수 관리 //
    const [selectedGender, setSelectedGender] = useState<string>('');
    const [name, setName] = useState<string>('');

    // state: 아이디 관련 변수 상태 //
    const [id, setId] = useState<string>('');
    const [idMsgBool, setIdMsgBool] = useState<boolean>(false);
    const [idMessage, setIdMessage] = useState<string>('');

    // state: 생일 관련 변수 상태 //
    const [birth, setBirth] = useState<string>('');
    const [birthMessage, setBirthMessage] = useState<string>('');
    const [birthMsgBool, setBirthMsgBool] = useState<boolean>(false);

    // state: 비밀번호 관련 변수 상태 //
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    const [pwCheckMsg, setPwCheckMsg] = useState<string>('');
    const [isPwMatched1, setIsPwMatched1] = useState<boolean>(false);
    const [isPwMatched2, setPwIsMatched2] = useState<boolean>(false);

    // state: 전화번호 변수 상태 //
    const [telNumber, setTelNumber] = useState<string>('');
    const [authNumber, setAuthNumber] = useState<string>('');
    const [telMessage, setTelMessage] = useState<string>('');
    const [authMessage, setAuthMessage] = useState<string>('');
    const [isMatched1, setIsMatched1] = useState<boolean>(false);
    const [isMatched2, setIsMatched2] = useState<boolean>(false);

    // variable: 회원가입 가능 상태 확인 //
    const isPossible = name && idMsgBool && isPwMatched1 && isPwMatched2 && birthMsgBool && selectedGender
        && isMatched1 && isMatched2;

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 아이디 변경 이벤트 핸들러 //
    const idChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setId(value);
    }

    // event handler: 아이디 중복 확인 버튼 클릭 이벤트 핸들러 //
    const idDuplicatedCheck = () => {
        const example = 'qwer1234';
        let isTrue = id === example;
        setIdMsgBool(!isTrue);
        if(isTrue) setIdMessage('이미 사용 중인 아이디가 있습니다.');
        else setIdMessage('사용 가능한 아이디입니다.');
    }

    // event handler: 비밀번호 변경 이벤트 핸들러 //
    const passwordChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setPassword(value);

        const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
        let isTrue = pattern.test(value);
        console.log(isTrue);
        setIsPwMatched1(isTrue);

        if(!isTrue) setPasswordMessage('영문, 숫자를 혼용하여 8~13자 입력해주세요.');
        else setPasswordMessage('');
    }

    // event handler: 비밀번호 확인 변경 이벤트 핸들러 //
    const onPwCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setPasswordCheck(value);

        let isTrue = (password === value);
        setPwIsMatched2(isTrue);
        
        if(!isTrue) setPwCheckMsg('비밀번호가 일치하지 않습니다.');
        else setPwCheckMsg('');
    }

    // event handler: 이름 변경 이벤트 핸들러 //
    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setName(value);
    }

    // event handler: 생년월일 변경 이벤트 핸들러 //
    const onBirthChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setBirth(value);

        if (value.length === 8) {
            const year = parseInt(value.substring(0, 4), 10);
            const month = parseInt(value.substring(4, 6), 10) - 1; // 월은 0부터 시작
            const day = parseInt(value.substring(6, 8), 10);

            const inputDate = new Date(year, month, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // 오늘의 시간 초기화

            if (inputDate > today) {
                setBirthMessage('일치하지 않는 형식입니다.');
                setBirthMsgBool(false);
            }else{
                setBirthMessage('');
                setBirthMsgBool(true);
            }

        } else if(value.length === 0) {
            setBirthMessage('');
            setBirthMsgBool(false);
        } else {
            setBirthMessage('일치하지 않는 형식입니다.');
            setBirthMsgBool(false);
        }
    }

    // event handler: 성별 선택 이벤트 핸들러 //
    const selectedGenderClickHandler = (selectedGender: string) => {
        setSelectedGender(selectedGender);
        console.log(selectedGender);
    }

    // event handler: 전화번호 변경 이벤트 핸들러 //
    const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setTelNumber(value);
    }

    // event handler: 전화번호 인증번호 변경 이벤트 핸들러 //
    const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setAuthNumber(value);
    }

    // event handler: 전송 버튼 클릭 이벤트 핸들러 //
    const onSendClickHandler = () => {
        if(!telNumber) {
            setTelMessage('');
            return;
        }

        const pattern = /^[0-9]{11}$/;
        const isTrue = pattern.test(telNumber);
        setIsMatched1(isTrue);

        if(isTrue) setTelMessage('인증번호가 전송되었습니다.');
        else setTelMessage('전화번호 11자 입력해주세요.');
    }

    // event handler: 인증 번호 확인 버튼 클릭 이벤트 핸들러 //
    const onCheckClickHandler = () => {
        if(!authNumber) return;

        // 랜덤 생성한 인증 번호 4자리와 일치하다면
        const isTrue = true;
        setIsMatched2(isTrue);

        if(isTrue) setAuthMessage('인증번호가 일치합니다.');
        else setAuthMessage('인증번호가 일치하지 않습니다.');
    }

    // event handler: 엔터키로 회원가입 버튼 동작 //
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            signUpClickHandler();
        }
    }

    // event handler: 회원가입 버튼 클릭 이벤트 핸들러 //
    const signUpClickHandler = () => {
        if(!isPossible) {
            alert('정확하게 입력해주세요.');
            return;
        }
        else{
            alert('회원가입 완료.');
            navigator(LOGIN_PATH);
        }
    }

    //render: 회원가입 화면 렌더링 //
    return (
        <div id='sign-up' style={{width:"450px"}}>
            <div className='auth-title'>회원가입</div>

            <div className='sub-title'>SNS 회원가입</div>
                <div className='sns-container'>
                    <div className='kakao'></div>
                    <div className='naver'></div>
                    <div className='google'></div>
                </div>
                <hr className='hr-custom-two'/>

            <div className='login-box'>
                
                <div className='box-test'>
                    <input className='inputs' placeholder='아이디' value={id} onChange={idChangeHandler}/>
                    <div className='send-button' onClick={idDuplicatedCheck}>중복 확인</div>
                </div>
                <div className= {idMsgBool ? 'message-true' : 'message-false'}>{idMessage}</div>

                <input className='inputs1' placeholder='비밀번호 (영문+숫자 8~13자)' type='password' value={password} onChange={passwordChangeHandler}/>
                <div className= {isPwMatched1 ? 'message-true' : 'message-false'}>{passwordMessage}</div>

                <input className='inputs1' placeholder='비밀번호 확인' type='password' value={passwordCheck} onChange={onPwCheckChangeHandler}/>
                <div className={isPwMatched2 ? 'message-true' : 'message-false'}>{pwCheckMsg}</div>

                <input className='inputs1' placeholder='이름' style={{marginBottom:"25px"}} value={name} onChange={onNameChangeHandler}/>

                <input className='inputs1' placeholder='생년월일(YYYYMMDD)' value={birth} onChange={onBirthChangeHandler} 
                        maxLength={8}/>
                <div className= {birthMsgBool ? 'message-true' : 'message-false'}>{birthMessage}</div>

                <div className='gender-box'>
                    <div 
                        onClick={() => {selectedGenderClickHandler('여')}}
                        className= {selectedGender === '여' ? 'selected' : 'unselected'}
                    >여성</div>
                    <div 
                        onClick={() => {selectedGenderClickHandler('남')}}
                        className= {selectedGender === '남' ? 'selected' : 'unselected'}
                    >남성</div>
                </div>

                <div className='box-test'>
                    <input className='inputs' placeholder='전화번호 – 빼고 입력해주세요' value={telNumber} onChange={onTelNumberChangeHandler}/>
                    <div className='send-button' onClick={onSendClickHandler}>전화번호 인증</div>
                </div>
                <div className= {isMatched1 ? 'message-true' : 'message-false'}>{telMessage}</div>

                {isMatched1 && 
                    <div>
                        <div className='box-test'>
                            <input className='inputs' placeholder='인증번호 4자리' onKeyDown={handleKeyDown} value={authNumber} onChange={onAuthNumberChangeHandler}/>
                            <div className='send-button' onClick={onCheckClickHandler}>인증 확인</div>
                        </div>
                        <div className= {isMatched2 ? 'message-true' : 'message-false'}>{authMessage}</div>
                    </div>
                }

                <div className='signup-button' onClick={signUpClickHandler}>회원가입</div>
            </div>
        </div>
    )
}