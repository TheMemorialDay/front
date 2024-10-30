import React, { ChangeEvent, useState } from 'react'
import './style.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LOGIN_PATH, SIGN_IN_ABSOLUTE_PATH } from '../../../constants';
import SnsContainer from '../../../components/sns_login_sign_up';
import { ResponseDto } from '../../../apis/dto/response';
import { IdCheckRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from '../../../apis/dto/request';
import { idCheckRequest, signUpRequest, telAuthCheckRequest, telAuthRequest } from '../../../apis';

// component: 회원가입 화면 컴포넌트 //
export default function SignUp() {

    // state: Query Parameter 상태 //
    const [queryParam] = useSearchParams();
    const snsId = queryParam.get('snsId');
    const joinPath = queryParam.get('joinPath');

    // state: 기타 관련 변수 관리 //
    const [selectedGender, setSelectedGender] = useState<string>('');
    const [name, setName] = useState<string>('');

    // state: 아이디 관련 변수 상태 //
    const [id, setId] = useState<string>('');
    const [idMsgBool, setIdMsgBool] = useState<boolean>(false);
    const [idMessage, setIdMessage] = useState<string>('');

    // state: 성별 상태 //
    const [gender, setGender] = useState<string>('');

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
    const [telAuthNumber, setTelAuthNumber] = useState<string>('');

    const [telMessage, setTelMessage] = useState<string>('');
    const [telNumberMessageError, setTelNumberMessageError] = useState<boolean>(false);

    const [authMessage, setAuthMessage] = useState<string>('');
    const [telAuthCheckMessageError, setTelAuthCheckMessageError] = useState<boolean>(false);

    //const [isTelNumber, ]

    const [isMatched1, setIsMatched1] = useState<boolean>(false);
    const [isMatched2, setIsMatched2] = useState<boolean>(false);

    // state: 입력값 검증 상태 //
    const [isCheckId, setCheckId] = useState<boolean>(false);
    const [isSend, setSend] = useState<boolean>(false);
    const [isCheckedAuthNumber, setCheckedAuthNumber] = useState<boolean>(false);

    // variable: SNS 회원가입 여부 //
    const isSnsSignUp = snsId !== null && joinPath !== null;

    // variable: 회원가입 가능 상태 확인 //
    const isPossible = name && idMsgBool && isPwMatched1 && isPwMatched2 && birthMsgBool && selectedGender
        && isMatched1 && isMatched2 && isSend && isCheckedAuthNumber && isCheckId;

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: 아이디 중복 확인 Response 처리 함수 //
    const idCheckResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' :
            responseBody.code === 'DI' ? '이미 사용 중인 아이디입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'SU' ? '사용 가능한 아이디입니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setIdMessage(message);
        setIdMsgBool(isSuccessed);
        setCheckId(isSuccessed);
    };

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
        setTelMessage(message);
        setIsMatched1(isSuccessed);
        setTelNumberMessageError(isSuccessed);
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
        setAuthMessage(message);
        setTelAuthCheckMessageError(!isSuccessed);
        setCheckedAuthNumber(isSuccessed);
        setIsMatched2(isSuccessed);
    };

    // function: 회원가입 Response 처리 함수 //
    const signUpResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' :
            responseBody.code === 'DI' ? '이미 사용 중인 아이디입니다.' :
            responseBody.code === 'DT' ? '중복된 전화번호입니다.' :
            responseBody.code === 'TAF' ? '인증번호가 일치하지 않습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        navigator(SIGN_IN_ABSOLUTE_PATH);
    };

    // event handler: 아이디 변경 이벤트 핸들러 //
    const idChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setId(value);

        setCheckId(false);
        setIdMessage('');
    }

    // event handler: 아이디 중복 확인 버튼 클릭 이벤트 핸들러 //
    const idDuplicatedCheck = () => {
        if (!id) return;

        const requestBody: IdCheckRequestDto = {
            userId: id
        }

        idCheckRequest(requestBody).then(idCheckResponse);
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

        setSend(false);
        setTelMessage('');
    }

    // event handler: 인증번호 변경 이벤트 핸들러 //
    const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setTelAuthNumber(value);
    }

    // event handler: 전화번호 인증 및 인증번호 전송 버튼 클릭 이벤트 핸들러 //
    const onSendClickHandler = () => {
        if(!telNumber) {
            setTelMessage('');
            return;
        }

        const pattern = /^[0-9]{11}$/;
        const isTrue = pattern.test(telNumber);
        console.log("istrue:"+isTrue);

        if (isTrue) {
            setTelMessage('');
            //alert(telMessage);
            const requestBody: TelAuthRequestDto = { telNumber };
            telAuthRequest(requestBody).then(telAuthResponse);
        }else {
            

            setTelMessage('숫자 11자로 입력해주세요.');
            alert(telMessage);
            setTelNumberMessageError(true);
            return;
        }
    }

    // event handler: 인증 번호 확인 버튼 클릭 이벤트 핸들러 //
    const onCheckClickHandler = () => {
        if(!telAuthNumber) return;

        const requestBody: TelAuthCheckRequestDto = { telNumber, telAuthNumber };
        telAuthCheckRequest(requestBody).then(telAuthCheckResponse);
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

        const requestBody: SignUpRequestDto = {
            userId: id,
            password,
            name,
            birth,
            gender: selectedGender,
            telNumber,
            telAuthNumber,
            joinPath: joinPath ? joinPath : 'home',
            snsId
        };

        signUpRequest(requestBody).then(signUpResponse);
    }

    //render: 회원가입 화면 렌더링 //
    return (
        <div id='sign-up' style={{width:"450px"}}>
            <div className='auth-title'>회원가입</div>

            <div className='sub-title'>SNS 회원가입</div>
            <SnsContainer />
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
                    <input className='inputs' placeholder='전화번호 – 빼고 입력해주세요' value={telNumber} onChange={onTelNumberChangeHandler} />
                    <div className='send-button' onClick={onSendClickHandler}>전화번호 인증</div>
                </div>
                <div className= {isMatched1 ? 'message-true' : 'message-false'}>{telMessage}</div>

                {isMatched1 && 
                    <div>
                        <div className='box-test'>
                            <input className='inputs' placeholder='인증번호 4자리' onKeyDown={handleKeyDown} value={telAuthNumber} onChange={onAuthNumberChangeHandler}/>
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