import React, { ChangeEvent, useEffect, useState } from 'react'
import './style.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ACCESS_TOKEN, ROOT_PATH, SIGN_UP_ABSOLUTE_PATH } from '../../constants';
import { useCookies } from 'react-cookie';
import SnsContainer from '../../components/sns_login_sign_up';
import { IdSearchResponseDto, SignInResponseDto } from '../../apis/dto/response/auth';
import { ResponseDto } from '../../apis/dto/response';
import { idSearchAfterRequest, idSearchBeforeRequest, passwordSearchRequest, signInRequest } from '../../apis';
import { IdSearchAfterRequestDto, IdSearchBeforeRequestDto, PasswordSearchRequestDto, SignInRequestDto } from '../../apis/dto/request/auth';
import useIdSearchResult from '../../stores/id-search-result-store';


type AuthPath = 'logIn' | 'findId' | 'findIdResult' | 'findPassword' | 'changePassword';
interface AuthComponentProps {
    onPathChange: (path: AuthPath) => void;
}

// component: 로그인 화면 컴포넌트 //
function SignIn({ onPathChange }: AuthComponentProps) {

    // state: 쿠키 상태 //
    const [cookies, setCookies] = useCookies();

    // state: 로그인 입력 정보 상태 //
    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setErrorBool] = useState<boolean>(false);

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: 로그인 Response 처리 함수 //
    const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '아이디와 비밀번호를 모두 입력하세요.' :
                    responseBody.code === 'SF' ? '로그인 정보가 일치하지 않습니다.' :
                        responseBody.code === 'TCF' ? '서버에 문제가 있습니다.' :
                            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody != null && responseBody.code === 'SU';
        if (!isSuccessed) {
            setMessage(message);
            return;
        }

        const { accessToken, expiration } = responseBody as SignInResponseDto;
        const expires = new Date(Date.now() + (expiration * 1000));
        setCookies(ACCESS_TOKEN, accessToken, { path: ROOT_PATH, expires });

        navigator(ROOT_PATH);
    };

    // event handler: 아이디 변경 이벤트 핸들러 //
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setId(value);
    }

    // event handler: 비밀번호 번경 이벤트 핸들러 //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPassword(value);
    }

    // event handler: 엔터키로 로그인 버튼 동작 //
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onLoginClickHandler();
        }
    }

    // event handler: 로그인 버튼 클릭 이벤트 핸들러 //
    const onLoginClickHandler = () => {
        if (!id || !password) {
            alert('아이디와 비밀번호를 모두 입력하세요.');
            return;
        }

        const requestBody: SignInRequestDto = {
            userId: id,
            password
        };

        signInRequest(requestBody).then(signInResponse);

        setId('');
        setPassword('');
    }

    // event handler: 회원가입 클릭 이벤트 핸들러 //
    const signUpClickHandler = () => {
        navigator(SIGN_UP_ABSOLUTE_PATH);
    }

    // effect: 아이디 및 비밀번호 변경시마다 입력창 비워주기 //
    useEffect(() => {
        setMessage('');
    }, [id, password]);

    //render: 로그인 화면 컴포넌트 렌더링 //
    return (
        <div id='signIn'>
            <div className='auth-title'>로그인</div>
            <div className='login-box'>
                <input value={id} onChange={onIdChangeHandler} className='input-id' placeholder='아이디'></input>
                <input type='password' value={password} onKeyDown={handleKeyDown} onChange={onPasswordChangeHandler} className='input-id' placeholder='비밀번호'></input>
                <div className={error ? 'message-true' : 'message-false'}>{message}</div>
            </div>
            <div className='login-button' onClick={onLoginClickHandler}>로그인</div>
            <hr className='hr-custom' />
            <div className='etc-function'>
                <div className='find' onClick={() => onPathChange('findId')}>아이디 찾기</div>
                <div>|</div>
                <div className='find' onClick={() => onPathChange('findPassword')}>비밀번호 찾기</div>
                <div>|</div>
                <div className='find' onClick={signUpClickHandler}>회원가입</div>
            </div>
            <SnsContainer />
        </div>
    )
}

// component: 아이디 찾기 화면 컴포넌트 //
function FindId({ onPathChange }: AuthComponentProps) {

    // state: 변수 상태 //
    const [name, setName] = useState<string>('');
    const [telNumber, setTelNumber] = useState<string>('');
    const [telAuthNumber, setTelAuthNumber] = useState<string>('');
    const [telMessage, setTelMessage] = useState<string>('');
    const [authMessage, setAuthMessage] = useState<string>('');
    const [isMatched1, setIsMatched1] = useState<boolean>(false);
    const [isMatched2, setIsMatched2] = useState<boolean>(false);

    // state: 아이디 찾기 상태 //
    const [idSearchMessage, setIdSearchMessage] = useState<string>('');

    // state: 아이디 찾기 입력값 검증 상태 //
    const [isName, setIsName] = useState<boolean>(false);
    const [isTelNumber, setIsTelNumber] = useState<boolean>(false);
    const [isTelAuthNumber, setIsTelAuthNumber] = useState<boolean>(false);

    // variable: 아이디 찾기 가능 상태 확인 //
    const isIdSearchPossible = isName && isTelNumber && isTelAuthNumber;

    // variable: 변수 선언 //
    const isPossible = isName && isMatched1 && isMatched2;
    const {zusName, zusUserId, zusTelNumber, setZusName, setZusTelNumber, setZusUserId} = useIdSearchResult();

    // function: 네비게이터 //
    const navigator = useNavigate();

    // function: 아이디 찾기 before Response 처리 함수 //
    const idSearchBeforeResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'NF' ? '존재하지 않는 정보입니다.' :
            responseBody.code === 'TF' ? '전송에 실패했습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'SU' ? '정보가 확인되었습니다.' : '';

        const isSuccessed = responseBody != null && responseBody.code === 'SU';
        if (!isSuccessed) {
            setIdSearchMessage(message);
            return;
        }
        
    };

    // function: 아이디 찾기 after Response 처리 함수 //
    const idSearchAfterResponse = (responseBody: IdSearchResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'TAF' ? '인증번호가 일치하지 않습니다.' :
                    responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody != null && responseBody.code === 'SU';
        if (!isSuccessed) {
            setIdSearchMessage(message);
            return;
        }
        const idCheckResult = responseBody as IdSearchResponseDto;
        setZusName(idCheckResult.name);
        setZusTelNumber(idCheckResult.telNumber);
        setZusUserId(idCheckResult.userId);
    };

    // event handler: 이름 변경 이벤트 핸들러 //
    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setName(value);
        setIsName(true);
    }

    // event Handler: 전화번호 변경 이벤트 처리 //
    const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setTelNumber(value);
        setIsTelNumber(true);
    };

    // event handler: 전화번호 인증번호 변경 이벤트 핸들러 //
    const onAuthNumberChangeHandler = (evnet: ChangeEvent<HTMLInputElement>) => {
        const { value } = evnet.target;
        setTelAuthNumber(value);
        setIsTelAuthNumber(true);
    };

    // event handler: 아이디 찾기 이름 & 전화번호 입력 후 전송 버튼 클릭 이벤트 핸들러 //
    const onSendClickHandler = () => {
        if (!telNumber) return;

        const pattern = /^[0-9]{11}$/;
        const isTrue = pattern.test(telNumber);
        setIsMatched1(isTrue);

        if (isTrue) {
            setIdSearchMessage('');
            const requestBody: IdSearchBeforeRequestDto = { name, telNumber };
            idSearchBeforeRequest(requestBody).then(idSearchBeforeResponse);
        }
    }

    // event handler: 인증 번호 확인 버튼 클릭 이벤트 핸들러 //
    const onCheckClickHandler = () => {
        if (!telAuthNumber) {
            setAuthMessage('인증번호가 일치하지 않습니다.');
            return;
        }

        // 랜덤 생성한 인증 번호 4자리와 일치하다면
        const isTrue = true;
        setIsMatched2(isTrue);

        if (isTrue) setAuthMessage('인증번호가 일치합니다.');
        else setAuthMessage('인증번호가 일치하지 않습니다.');
    }

    // event handler: 엔터키로 전송 버튼 동작 //
    const handleKeyDown1 = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSendClickHandler();
        }
    }

    // event handler: 엔터키로 전화번호 인증번호 확인 버튼 동작 //
    const handleKeyDown2 = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onCheckClickHandler();
        }
    }

    // event handler: 최종 아이디 찾기 버튼 클릭 //
    const onIdSearchClickHandler = () => {
        if (!isIdSearchPossible) {
            alert('정확하게 입력해주세요.');
            return;
        }
        
        onPathChange('findIdResult');

        const requestBody: IdSearchAfterRequestDto = { telNumber, telAuthNumber };
        idSearchAfterRequest(requestBody).then(idSearchAfterResponse);
    };

    //render: 아이디 찾기 화면 렌더링 //
    return (
        <div id='find-id'>
            <div className='auth-title'>아이디 찾기</div>
            <div className='login-box'>
                <input className='input-id' placeholder='이름' value={name} onChange={onNameChangeHandler}></input>
                <div className='tel'>
                    <input className='tel-number' placeholder='전화번호 – 빼고 입력해주세요.' value={telNumber} onChange={onTelNumberChangeHandler} onKeyDown={handleKeyDown1} />
                    <div className='send-button' onClick={onSendClickHandler}>전송</div>
                </div>
                <div className={isMatched1 ? 'message-true' : 'message-false'}>{telMessage}</div>

                {isMatched1 &&
                    <div>
                        <div className='tel' style={{ marginTop: '20px' }}>
                            <input className='tel-number' placeholder='인증번호 4자리' value={telAuthNumber} onChange={onAuthNumberChangeHandler} onKeyDown={handleKeyDown2} />
                            <div className='send-button' onClick={onCheckClickHandler}>확인</div>
                        </div>
                        <div className={isMatched2 ? 'message-true' : 'message-false'}>{authMessage}</div>
                    </div>
                }


            </div>

            <div className='login-button' onClick={onIdSearchClickHandler} >아이디 찾기 확인</div>
        </div>
    )
}

// component: 아이디 찾기 결과 화면 컴포넌트 //
function FindIdResult({ onPathChange }: AuthComponentProps) {

    // state: 아이디 찾기 입력값 검증 상태 //
    const [isName, setIsName] = useState<boolean>(false);
    const [isTelNumber, setIsTelNumber] = useState<boolean>(false);
    const [isTelAuthNumber, setIsTelAuthNumber] = useState<boolean>(false);

    const [telAuthNumber, setTelAuthNumber] = useState<string>('');
    
    // state: 아이디 찾기 상태 //
    const [idSearchMessage, setIdSearchMessage] = useState<string>('');

    // state: zustand 만든 거 가져오기 //
    const { zusName, setZusName, zusTelNumber, setZusTelNumber, zusUserId, setZusUserId } = useIdSearchResult();
    //const {} = useIdSearchResult();
    const message = zusName + ", " + zusTelNumber + ", " + zusUserId;
    alert(message);

    // variable: 아이디 찾기 가능 상태 확인 //
    const isIdSearchPossible = isName && isTelNumber && isTelAuthNumber;

    // function: 네비게이터 //
    const navigator = useNavigate();

    //render: 아이디 찾기 결과 화면 렌더링 //
    return (
        <div id='find-id-result'>
            <div className='auth-title'>아이디 찾기 결과</div>
            <div className='login-box'>
                <div className='one-line'>
                    <div className='name'>이름</div>
                    <div className='name-result'>{zusName}</div>
                </div>
                <div className='one-line'>
                    <div className='telNumber'>전화번호</div>
                    <div className='telNumber-result'>{zusTelNumber}</div>
                </div>
                <div className='one-line'>
                    <div className='id'>아이디</div>
                    <div className='id-result'>{zusUserId}</div>
                </div>
            </div>
            <div className='login-button' onClick={() => onPathChange('logIn')}>로그인</div>
            <div className='login-button-2' onClick={() => onPathChange('findPassword')}>비밀번호 찾기</div>
        </div>
    )
}

// component: 비밀번호 찾기 화면 컴포넌트 //
function FindPassword({ onPathChange }: AuthComponentProps) {

    // state: 변수 상태 //
    const [id, setId] = useState<string>('');
    const [telNumber, setTelNumber] = useState<string>('');
    const [authNumber, setAuthNumber] = useState<string>('');
    const [telMessage, setTelMessage] = useState<string>('');
    const [authMessage, setAuthMessage] = useState<string>('');
    const [isMatched1, setIsMatched1] = useState<boolean>(false);
    const [isMatched2, setIsMatched2] = useState<boolean>(false);

    // state: 메시지 상태 //
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [passwordMessageError, setPasswordMessageError] = useState<boolean>(false);

    // state: 인증번호 전송 상태 //
    const [isSend, setSend] = useState<boolean>(false);

    // state: request를 위한 없는 상태 만든 거 //
    const [userId, setUserId] = useState<string>('');

    // variable: 변수 선언 //
    const isPossible = id && isMatched1 && isMatched2;

    // function: 비밀번호 찾기 (userId + telNumber) Response 처리 함수 //
    const passwordSearchResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'NF' ? '존재하지 않는 정보입니다.' :
            responseBody.code === 'TF' ? '전송에 실패했습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setPasswordMessage(message);
        setPasswordMessageError(!isSuccessed)
        setSend(isSuccessed);
    };

    // event handler: 아이디 변경 이벤트 핸들러 //
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setId(value);
    }

    // event Handler: 전화번호 변경 이벤트 처리 //
    const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setTelNumber(value);
    };

    // event handler: 전화번호 인증번호 변경 이벤트 핸들러 //
    const onAuthNumberChangeHandler = (evnet: ChangeEvent<HTMLInputElement>) => {
        const { value } = evnet.target;
        setAuthNumber(value);
    };

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

        const requestBody: PasswordSearchRequestDto = { userId, telNumber };
        passwordSearchRequest(requestBody).then(passwordSearchResponse);
    }

    // event handler: 인증 번호 확인 버튼 클릭 이벤트 핸들러 //
    const onCheckClickHandler = () => {
        if (!authNumber) {
            setAuthMessage('인증번호가 일치하지 않습니다.');
            return;
        }

        // 랜덤 생성한 인증 번호 4자리와 일치하다면
        const isTrue = true;
        setIsMatched2(isTrue);

        if (isTrue) setAuthMessage('인증번호가 일치합니다.');
        else setAuthMessage('인증번호가 일치하지 않습니다.');
    }

    // event handler: 엔터키로 전송 버튼 동작 //
    const handleKeyDown1 = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSendClickHandler();
        }
    }

    // event handler: 엔터키로 전화번호 인증번호 확인 버튼 동작 //
    const handleKeyDown2 = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onCheckClickHandler();
        }
    }

    //render: 비밀번호 찾기 화면 렌더링 //
    return (
        <div id='find-password'>
            <div className='auth-title'>비밀번호 찾기</div>
            <div className='login-box'>
                <input className='input-id' placeholder='아이디' value={id} onChange={onIdChangeHandler}></input>
                <div className='tel'>
                    <input className='tel-number' placeholder='전화번호 – 빼고 입력해주세요.' value={telNumber} onChange={onTelNumberChangeHandler} onKeyDown={handleKeyDown1} />
                    <div className='send-button' onClick={onSendClickHandler}>전송</div>
                </div>
                <div className={isMatched1 ? 'message-true' : 'message-false'}>{telMessage}</div>

                {isMatched1 &&
                    <div>
                        <div className='tel' style={{ marginTop: '20px' }}>
                            <input className='tel-number' placeholder='인증번호 4자리' value={authNumber} onChange={onAuthNumberChangeHandler} onKeyDown={handleKeyDown2} />
                            <div className='send-button' onClick={onCheckClickHandler}>확인</div>
                        </div>
                        <div className={isMatched2 ? 'message-true' : 'message-false'}>{authMessage}</div>
                    </div>
                }


            </div>
            <div className='login-button' onClick={() => isPossible ? onPathChange('changePassword') : alert('정보를 모두 입력해주세요')}>비밀번호 재설정</div>
        </div>
    )
}

// component: 비밀번호 재설정 화면 컴포넌트 //
function ChangePassword({ onPathChange }: AuthComponentProps) {

    // state: 변수 상태 //
    const [password, setPassword] = useState<string>('');
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [pwCheckMsg, setPwCheckMsg] = useState<string>('');
    const [isMatched1, setIsMatched1] = useState<boolean>(false);
    const [isMatched2, setIsMatched2] = useState<boolean>(false);

    // event handler: 비밀번호 변경 이벤트 핸들러 //
    const onChangePasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPassword(value);

        const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
        let isTrue = pattern.test(value);
        console.log(isTrue);
        setIsMatched1(isTrue);

        if (!isTrue) setPasswordMessage('영문, 숫자를 혼용하여 8~13자 입력해주세요.');
        else setPasswordMessage('');

    }

    // event handler: 비밀번호 확인 변경 이벤트 핸들러 //
    const onChangePwCheckHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPasswordCheck(value);

        let isTrue = (password === value);
        setIsMatched2(isTrue);

        if (!isTrue) setPwCheckMsg('비밀번호가 일치하지 않습니다.');
        else setPwCheckMsg('');

    }

    // render: 비밀번호 재설정 화면 렌더링 //
    return (
        <div id='change-password'>
            <div className='auth-title'>비밀번호 재설정</div>
            <div className='login-box'>
                <input className='input-id' type='password' placeholder='비밀번호 (영문+숫자 8~13자)' value={password} onChange={onChangePasswordHandler} />
                <div className={isMatched1 ? 'message-true' : 'message-false'}>{passwordMessage}</div>
                <input className='input-id' type='password' placeholder='비밀번호 확인' value={passwordCheck} onChange={onChangePwCheckHandler} />
                <div className={isMatched2 ? 'message-true' : 'message-false'}>{pwCheckMsg}</div>
            </div>
            <div className='login-button' onClick={() => onPathChange('logIn')}>비밀번호 변경</div>
        </div>
    )
}

// component: 인증 화면 컴포넌트 //
export default function Auth() {

    // state: query parameter 상태 //
    const [queryParam] = useSearchParams();

    // state: 선택 화면 상태 //
    const [path, setPath] = useState<AuthPath>('logIn');

    // event Handler: 화면 변경 이벤트 처리 //
    const onPathChangeHandler = (path: AuthPath) => {
        setPath(path);
    };

    // render: 인증 화면 컴포넌트 렌더링 //
    return (
        <div id="auth-wrapper">
            <div className='auth-container'>
                {
                    path === 'logIn' ? <SignIn onPathChange={onPathChangeHandler} /> :
                    path === 'findId' ? <FindId onPathChange={onPathChangeHandler} /> :
                    path === 'findIdResult' ? <FindIdResult onPathChange={onPathChangeHandler} /> :
                    path === 'findPassword' ? <FindPassword onPathChange={onPathChangeHandler} /> :
                    path === 'changePassword' ? <ChangePassword onPathChange={onPathChangeHandler} /> : ''
                }
            </div>
        </div>
    )
}
