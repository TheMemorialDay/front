import React, { ChangeEvent, useEffect, useState } from 'react'
import './style.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ACCESS_TOKEN, ROOT_PATH, SIGN_UP_ABSOLUTE_PATH } from '../../constants';
import { useCookies } from 'react-cookie';
import SnsContainer from '../../components/sns_login_sign_up';
import { GetOnlyPasswordResponseDto, IdSearchResponseDto, SignInResponseDto } from '../../apis/dto/response/auth';
import { ResponseDto } from '../../apis/dto/response';
import { getIdSearchRequest, idSearchNameTelNumberRequest, idSearchTelAuthRequest, passwordSearchRequest, passwordSearchTelAuthCheckRequest, patchPasswordRequest, signInRequest } from '../../apis';
import { IdSearchNameTelNumberRequestDto, PasswordSearchRequestDto, PasswordSearchTelAuthCheckRequestDto, PatchPasswordRequestDto, SignInRequestDto, TelAuthCheckRequestDto } from '../../apis/dto/request/auth';
import usePatchPasswordZustand from '../../stores/patch-password.store';
import useIdSearchResultZustand from '../../stores/id-search-result-store';


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
    
    // state: 메시지 상태 //
    const [nameMessage, setNameMessage] = useState<string>('');
    const [telMessage, setTelMessage] = useState<string>('');
    const [authMessage, setAuthMessage] = useState<string>('');
    
    // state: 메시지 에러 상태 //
    const [isNameMessageError, setNameMessageError] = useState<boolean>(false);
    const [isTelMessageError, setTelMessageError] = useState<boolean>(false);
    const [isAuthMessageError, setAuthMessageError] = useState<boolean>(false);
    
    // state: 아이디 찾기 입력값 검증 상태 //
    const [isSend, setSend] = useState<boolean>(false);
    const [isName, setIsName] = useState<boolean>(false);
    const [isTelNumber, setIsTelNumber] = useState<boolean>(false);
    const [isCheckedTelAuthNumber, setIsCheckedTelAuthNumber] = useState<boolean>(false);
    const [isIdAndTelNumberMatched, setIdAndTelNumberMatched] = useState<boolean>(false);
    const [isTelNumberAndTelAuthNumberMatched, setTelNumberAndTelAuthNumberMatched] = useState<boolean>(false);

    // state: zustand 상태 //
    const { name, telNumber, userId, telAuthNumber, 
        setName, setTelNumber, setUserId, setTelAuthNumber
    } = useIdSearchResultZustand();

    // variable: 아이디 찾기 가능 상태 확인 //
    const isIdSearchPossible = name && telNumber && telAuthNumber && isSend && isName && isTelNumber && isCheckedTelAuthNumber;

    // function: 네비게이터 //
    const navigator = useNavigate();

    // function: 아이디 찾기 name + telNumber 1차 Response 처리 함수 //
    const idSearchNameTelNumberResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'NF' ? '존재하지 않는 정보입니다.' :
            responseBody.code === 'TF' ? '전송에 실패했습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'SU' ? '정보가 확인되었습니다.' : '';

        const isSuccessed = responseBody != null && responseBody.code === 'SU';
        setTelMessage(message);
        setTelMessageError(!isSuccessed);
        setSend(isSuccessed);
        
    };

    // function: 아이디 찾기에서 전화번호 + 인증번호 확인 Response 처리 함수 //
    const idSearchtelAuthCheckResponse = (responseBody: ResponseDto | null) => {
        const message = 
        !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' :
        responseBody.code === 'TAF' ? '인증번호가 일치하지 않습니다.' :
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
        responseBody.code === 'SU' ? '인증번호가 확인되었습니다.' : '';

        const isSuccessed = responseBody != null && responseBody.code === 'SU';

        setAuthMessage(message);
        setAuthMessageError(!isSuccessed);
        setIsCheckedTelAuthNumber(isSuccessed)
    };

    // function: 아이디 찾기 after Response 처리 함수 //
    const idSearchResultResponse = (responseBody: IdSearchResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'TAF' ? '인증번호가 일치하지 않습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody != null && responseBody.code === 'SU';

        if (!isSuccessed) return;

        const idCheckResult = responseBody as IdSearchResponseDto;
        setName(idCheckResult.name);
        setTelNumber(idCheckResult.telNumber);
        setUserId(idCheckResult.userId);
    };

    // event handler: 이름 변경 이벤트 핸들러 //
    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setName(value);

        const name = value;

        const message = value ? '' : '이름을 입력해주세요.';
        setNameMessage(message);
        setNameMessageError(true);
    }

    // event Handler: 전화번호 변경 이벤트 처리 //
    const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setTelNumber(value);

        setSend(false);
        setTelMessage('');
    };

    // event handler: 인증번호 변경 이벤트 핸들러 //
    const onAuthNumberChangeHandler = (evnet: ChangeEvent<HTMLInputElement>) => {
        const { value } = evnet.target;
        setTelAuthNumber(value);

        setAuthMessage('');
    };

    // event handler: 아이디 찾기 이름 & 전화번호 입력 후 전송 버튼 클릭 이벤트 핸들러 //
    const onSendClickHandler = () => {
        if (!name || !telNumber) return;

        const pattern = /^[0-9]{11}$/;
        const isMatched = pattern.test(telNumber);

        if (!isMatched) {
            setTelMessage('숫자 11자 입력해주세요.');
            setTelMessageError(true);
            return;
        }

        const requestBody: IdSearchNameTelNumberRequestDto = { name, telNumber };
        idSearchNameTelNumberRequest(requestBody).then(idSearchNameTelNumberResponse);
    }

    // event handler: 인증 번호 확인 버튼 클릭 이벤트 핸들러 //
    const onCheckClickHandler = () => {
        if (!telAuthNumber) {
            return;
        }

        const requestBody: TelAuthCheckRequestDto = {telNumber, telAuthNumber};
        idSearchTelAuthRequest(requestBody).then(idSearchtelAuthCheckResponse);
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

        getIdSearchRequest(name, telNumber).then(idSearchResultResponse);
    };

    //render: 아이디 찾기 화면 렌더링 //
    return (
        <div id='find-id'>
            <div className='auth-title'>아이디 찾기</div>
            <div className='login-box'>
                <div className='name'>
                    <input className='input-id' placeholder='이름' value={name} onChange={onNameChangeHandler} />
                    <div className={`name-message message ${isNameMessageError ? 'false' : 'true'}`}>{nameMessage}</div>
                </div>
                <div className='tel'>
                    <input className='tel-number' placeholder='전화번호 – 빼고 입력해주세요.' value={telNumber} onChange={onTelNumberChangeHandler} onKeyDown={handleKeyDown1} />
                    <div className='send-button' onClick={onSendClickHandler}>전송</div>
                </div>
                <div className={`message ${isTelMessageError ? 'false' : 'true' }`}>{telMessage}</div>

                {isSend &&
                    <div>
                        <div className='tel' style={{ marginTop: '20px' }}>
                            <input className='tel-number' placeholder='인증번호 4자리' value={telAuthNumber} onChange={onAuthNumberChangeHandler} onKeyDown={handleKeyDown2} />
                            <div className='send-button' onClick={onCheckClickHandler}>확인</div>
                        </div>
                        <div className={`message ${isAuthMessageError ? 'false' : 'true' }`}>{authMessage}</div>
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
    
    // state: 아이디 찾기 상태 //
    const [idSearchMessage, setIdSearchMessage] = useState<string>('');

    // state: zustand 만든 거 가져오기 //
    const { name, telNumber, userId, telAuthNumber, 
        setName, setTelNumber, setUserId, setTelAuthNumber
    } = useIdSearchResultZustand();

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
                    <div className='name-result'>{name}</div>
                </div>
                <div className='one-line'>
                    <div className='telNumber'>전화번호</div>
                    <div className='telNumber-result'>{telNumber}</div>
                </div>
                <div className='one-line'>
                    <div className='id'>아이디</div>
                    <div className='id-result'>{userId}</div>
                </div>
            </div>
            <div className='login-button' onClick={() => onPathChange('logIn')}>로그인</div>
            <div className='login-button-2' onClick={() => onPathChange('findPassword')}>비밀번호 찾기</div>
        </div>
    )
}

// component: 비밀번호 찾기 화면 컴포넌트 //
function FindPassword({ onPathChange }: AuthComponentProps) {

    // state: zustand 상태 //
    const { userId, zusTelNumber, telAuthNumber, zusPassword, 
        setUserId, setZusTelNumber, setTelAuthNumber, setZusPassword} 
        = usePatchPasswordZustand();

    // state: 메세지 상태 //
    const [telMessage, setTelMessage] = useState<string>('');
    const [authMessage, setAuthMessage] = useState<string>('');

    // state: 메세지 에러 상태 //
    const [isTelMessageError, setTelMessageError] = useState<boolean>(false);
    const [isAuthMessageError, setAuthMessageError] = useState<boolean>(false);

    // state: 인증 번호 전송여부 상태 //
    const [isSend, setSend] = useState<boolean>(false);
    // state: 전화번호 인증 여부 //
    const [isAuth, setAuth] = useState<boolean>(false);

    // variable: 비밀번호 재설정 가능 검증 //
    const isPatchPasswordPossible = userId && isSend && isAuth;

    // function: 비밀번호 찾기 (userId + telNumber) Response 처리 함수 //
    const passwordSearchResponse = (responseBody: GetOnlyPasswordResponseDto |ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'NF' ? '존재하지 않는 정보입니다.' :
            responseBody.code === 'TF' ? '전송에 실패했습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'SU' ? '인증번호를 전송하였습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';

        setTelMessage(message);
        setTelMessageError(!isSuccessed);
        setSend(isSuccessed);

        if (!isSuccessed) return;

        const { password } = responseBody as GetOnlyPasswordResponseDto;
        console.log(password);
    };

    // function: 비밀번호 찾기 (인증번호 telAuthNumber 확인) Response 처리 함수 //
    const passwordTelAuthCheckResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'TAF' ? '인증번호가 일치하지 않습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'SU' ? '인증번호가 일치합니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setAuthMessage(message);
        setAuthMessageError(!isSuccessed);
        setAuth(isSuccessed);
    };

    // event handler: 아이디 변경 이벤트 핸들러 //
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setUserId(value);
    }

    // event Handler: 전화번호 변경 이벤트 처리 //
    const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setZusTelNumber(value);
    };

    // event handler: 전화번호 인증번호 변경 이벤트 핸들러 //
    const onAuthNumberChangeHandler = (evnet: ChangeEvent<HTMLInputElement>) => {
        const { value } = evnet.target;
        setTelAuthNumber(value);
    };

    // event handler: 전송 버튼 클릭 이벤트 핸들러 //
    const onSendClickHandler = () => {
        if (!userId || !zusTelNumber) return;

        const pattern = /^[0-9]{11}$/;
        const isMatched = pattern.test(zusTelNumber);

        if (!isMatched) {
            setTelMessage('전화번호 11자 입력해주세요.');
            setTelMessageError(true);
            return;
        }

        const requestBody: PasswordSearchRequestDto = { userId, telNumber: zusTelNumber};
        passwordSearchRequest(requestBody).then(passwordSearchResponse);
    }

    // event handler: 인증 번호 확인 버튼 클릭 이벤트 핸들러 //
    const onCheckClickHandler = () => {
        if (!telAuthNumber) {
            setAuthMessage('인증번호를 입력하세요.');
            setAuthMessageError(true);
            return;
        }

        const requestBody: PasswordSearchTelAuthCheckRequestDto = { telNumber: zusTelNumber, telAuthNumber };
        passwordSearchTelAuthCheckRequest(requestBody).then(passwordTelAuthCheckResponse);
    }

    // event handler: 비밀번호 재설정 버튼 클릭 핸들러 //
    const onNextPatchPasswordClickHandler = () => {
        if (!isPatchPasswordPossible) return;

        onPathChange('changePassword');
    };

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
                <input className='input-id' placeholder='아이디' value={userId} onChange={onIdChangeHandler} />
                <div className='tel'>
                    <input className='tel-number' placeholder='전화번호 – 빼고 입력해주세요.' value={zusTelNumber} onChange={onTelNumberChangeHandler} onKeyDown={handleKeyDown1} />
                    <div className='send-button' onClick={onSendClickHandler}>전송</div>
                </div>
                <div className={`message ${isTelMessageError ? 'false' : 'true' }`}>{telMessage}</div>

                {isSend &&
                <div>
                    <div className='tel' style={{ marginTop: '20px' }}>
                        <input className='tel-number' placeholder='인증번호 4자리' value={telAuthNumber} onChange={onAuthNumberChangeHandler} onKeyDown={handleKeyDown2} />
                        <div className='send-button' onClick={onCheckClickHandler}>확인</div>
                    </div>
                    <div className={`message ${isAuth ? 'true' : 'false' }`}>{authMessage}</div>
                </div>
                }

            </div>
            <div className='login-button' onClick={onNextPatchPasswordClickHandler}>비밀번호 재설정</div>
        </div>
    )
}

// component: 비밀번호 재설정 화면 컴포넌트 //
function ChangePassword({ onPathChange }: AuthComponentProps) {

    // state: zustand 상태 //
    const { userId, zusTelNumber, telAuthNumber, zusPassword, setUserId, setZusTelNumber, setTelAuthNumber, setZusPassword} = usePatchPasswordZustand();

    // state: 새 비밀번호 상태 //
    const [newPassword, setNewPassword] = useState<string>('');

    // state: 변수 상태 //
    // const [password, setPassword] = useState<string>('');

    const [passwordCheck, setPasswordCheck] = useState<string>('');
    const [pwCheckMsg, setPwCheckMsg] = useState<string>('');
    const [isMatched1, setIsMatched1] = useState<boolean>(false);
    const [isMatched2, setIsMatched2] = useState<boolean>(false);
    
    // state: 메시지 상태 //
    const [passwordMessage, setPasswordMessage] = useState<string>('');

    // state: 에러메시지 상태 //
    // const [passwordMessageError, setPasswordMessageError] = useState<boolean>(false); 

    // state: 기존 비밀번호 현 비밀번호 비교 상태 //
    // const [CheckedPassword, setCheckedPassword] = useState<boolean>(false); // 중복 x

    // function: 비밀번호 재설정 Response 처리 함수 //
    const patchPasswordResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '같은 비밀번호는 사용할 수 없습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';

        if(!isSuccessed) {
            setPasswordMessage(message);
            setIsMatched1(isSuccessed);
            return;
        }

        alert('비밀번호가 변경되었습니다.');
        onPathChange('logIn');

    };

    // event handler: 비밀번호 변경 이벤트 핸들러 //
    const onChangePasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setNewPassword(value);

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

        let isTrue = (newPassword === value);
        setIsMatched2(isTrue);

        if (!isTrue) setPwCheckMsg('비밀번호가 일치하지 않습니다.');
        else setPwCheckMsg('');

    }

    // event handler: 비밀번호 변경 요청 버튼 이벤트 핸들러 //
    const onPatchPasswordClickHandler = () => {
        if (!newPassword) return;

        const requestBody: PatchPasswordRequestDto = { userId, telNumber: zusTelNumber, telAuthNumber, password: newPassword };
        patchPasswordRequest(requestBody).then(patchPasswordResponse);
    };

    // render: 비밀번호 재설정 화면 렌더링 //
    return (
        <div id='change-password'>
            <div className='auth-title'>비밀번호 재설정</div>
            <div className='login-box'>
                <input className='input-id' type='password' placeholder='비밀번호 (영문+숫자 8~13자)' value={newPassword} onChange={onChangePasswordHandler} />
                <div className={isMatched1 ? 'message-true' : 'message-false'}>{passwordMessage}</div>
                <input className='input-id' type='password' placeholder='비밀번호 확인' value={passwordCheck} onChange={onChangePwCheckHandler} />
                <div className={isMatched2 ? 'message-true' : 'message-false'}>{pwCheckMsg}</div>
            </div>
            <div className='login-button' onClick={onPatchPasswordClickHandler}>비밀번호 변경</div>
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
