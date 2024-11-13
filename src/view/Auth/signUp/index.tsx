import React, { ChangeEvent, useEffect, MouseEvent, useState, useRef } from 'react'
import './style.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SIGN_IN_ABSOLUTE_PATH } from '../../../constants';
import SnsContainer from '../../../components/sns_login_sign_up';
import { ResponseDto } from '../../../apis/dto/response';
import { idCheckRequest, signUpRequest, telAuthCheckRequest, telAuthRequest } from '../../../apis';
import { IdCheckRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from '../../../apis/dto/request/auth';

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

    const [isMatched1, setIsMatched1] = useState<boolean>(false);
    const [isMatched2, setIsMatched2] = useState<boolean>(false);

    // state: 전화번호 인증 재전송 상태 //
    const [isMatched3, setIsMatched3] = useState<boolean>(false);


    // state: 입력값 검증 상태 //
    const [isCheckId, setCheckId] = useState<boolean>(false);
    const [isSend, setSend] = useState<boolean>(false);
    const [isCheckedAuthNumber, setCheckedAuthNumber] = useState<boolean>(false);

    // state: 인증번호 타이머 //
    const [timer, setTimer] = useState(10);

    // state: 타이머를 멈출 상태 추가
    const [stopTimer, setStopTimer] = useState(false);

    // state: 전체 동의와 개별 동의 항목 상태 //
    const [allChecked, setAllChecked] = useState(false);
    const [terms, setTerms] = useState({
        service: false,
        privacy: false
    });
    const [showServiceTerms, setShowServiceTerms] = useState(false);
    const [showPrivacyTerms, setShowPrivacyTerms] = useState(false);

    // variable: SNS 회원가입 여부 //
    const isSnsSignUp = snsId !== null && joinPath !== null;

    // variable: 회원가입 가능 상태 확인 //
    const isPossible = name && idMsgBool && isPwMatched1 && isPwMatched2 && birthMsgBool && selectedGender
        && isMatched1 && isMatched2 && isSend && isCheckedAuthNumber && isCheckId && allChecked;

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
        if (isSuccessed) {
            setStopTimer(true);
        }
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
        const { value } = event.target;
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
    const passwordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPassword(value);

        const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
        let isTrue = pattern.test(value);
        console.log(isTrue);
        setIsPwMatched1(isTrue);

        if (!isTrue) setPasswordMessage('영문, 숫자를 혼용하여 8~13자 입력해주세요.');
        else setPasswordMessage('');
    }

    // event handler: 비밀번호 확인 변경 이벤트 핸들러 //
    const onPwCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPasswordCheck(value);

        let isTrue = (password === value);
        setPwIsMatched2(isTrue);

        if (!isTrue) setPwCheckMsg('비밀번호가 일치하지 않습니다.');
        else setPwCheckMsg('');
    }

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
            const month = parseInt(value.substring(4, 6), 10) - 1; // 월은 0부터 시작
            const day = parseInt(value.substring(6, 8), 10);

            const inputDate = new Date(year, month, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // 오늘의 시간 초기화

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
    const selectedGenderClickHandler = (selectedGender: string) => {
        setSelectedGender(selectedGender);
        console.log(selectedGender);
    }

    // event handler: 전화번호 변경 이벤트 핸들러 //
    const onTelNumberChangeHandler = (e: { target: { value: string } }) => {
        const numbersOnly = e.target.value.replace(/\D/g, "");
        if (numbersOnly.length <= 11) {
            setTelNumber(numbersOnly);
        }

        setSend(false);
        setTelMessage('');
    }

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

    // event handler: 인증번호 변경 이벤트 핸들러 //
    const onAuthNumberChangeHandler = (e: { target: { value: string } }) => {
        const numbersOnly = e.target.value.replace(/\D/g, "");
        if (numbersOnly.length <= 4) {
            setTelAuthNumber(numbersOnly);
        }
    }

    // Function: 타이머 //
    const formatTime = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    // event handler: 전화번호 인증 및 인증번호 전송 버튼 클릭 이벤트 핸들러 //
    const onSendClickHandler = () => {
        if (!telNumber) {
            setTelMessage('');
            return;
        }

        const pattern = /^[0-9]{11}$/;
        const isTrue = pattern.test(telNumber);

        if (isTrue) {
            setTelMessage('');
            setIsMatched3(true);
            setTimer(10);
            setTelAuthNumber('');
            setAuthMessage('');
            const requestBody: TelAuthRequestDto = { telNumber };
            telAuthRequest(requestBody).then(telAuthResponse);
        } else {
            setTelMessage('숫자 11자로 입력해주세요.');
            setTelNumberMessageError(true);
            return;
        }
    }

    // event handler: 인증 번호 확인 버튼 클릭 이벤트 핸들러 //
    const onCheckClickHandler = () => {
        if (!telAuthNumber) return;

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
        if (!isPossible) {
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

        alert('회원가입이 완료되었습니다.');
        signUpRequest(requestBody).then(signUpResponse);
    }

    // useRef로 interval을 관리
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Effect: 타이머 기능 구현 //

    useEffect(() => {
        if (isMatched1 && !stopTimer) { // stopTimer가 false일 때만 타이머 시작
            intervalRef.current = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(intervalRef.current!);
                        setIsMatched1(false);
                        setTelMessage('');
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }

        // stopTimer가 true가 되면 타이머를 멈추도록 추가
        if (stopTimer && intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isMatched1, stopTimer]);

    // event handler: 전체 동의 핸들러 //
    const handleAllChecked = (e: ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setAllChecked(checked);
        setTerms({
            service: checked,
            privacy: checked
        });
    };

    // event handler: 개별 동의 핸들러 //
    const handleTermChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setTerms((prevTerms) => ({
            ...prevTerms,
            [name]: checked,
        }));

        // 개별 체크박스의 상태에 따라 전체 동의 상태 업데이트
        setAllChecked(checked && Object.values({ ...terms, [name]: checked }).every(Boolean));
    };

    // event handler:  이용 약관 펼치기/접기 핸들러 //
    const toggleServiceTerms1 = () => {
        setShowServiceTerms(!showServiceTerms);
    };

    // event handler:  이용 약관 펼치기/접기 핸들러 //
    const toggleServiceTerms2 = () => {
        setShowPrivacyTerms(!showPrivacyTerms);
    };

    //render: 회원가입 화면 렌더링 //
    return (
        <div id='sign-up' style={{ width: "450px" }}>
            <div className='auth-title'>회원가입</div>

            <div className='sub-title'>SNS 회원가입</div>
            <SnsContainer />
            <hr className='hr-custom-two' />

            <div className='login-box'>

                <div className='box-test'>
                    <input className='inputs' placeholder='아이디' value={id} onChange={idChangeHandler} />
                    <div className='send-button' onClick={idDuplicatedCheck}>중복 확인</div>
                </div>
                <div className={idMsgBool ? 'message-true' : 'message-false'}>{idMessage}</div>

                <input className='inputs1' placeholder='비밀번호 (영문+숫자 8~13자)' type='password' value={password} onChange={passwordChangeHandler} />
                <div className={isPwMatched1 ? 'message-true' : 'message-false'}>{passwordMessage}</div>

                <input className='inputs1' placeholder='비밀번호 확인' type='password' value={passwordCheck} onChange={onPwCheckChangeHandler} />
                <div className={isPwMatched2 ? 'message-true' : 'message-false'}>{pwCheckMsg}</div>

                <input className='inputs1' placeholder='이름' style={{ marginBottom: "25px" }} value={name} onChange={onNameChangeHandler} />

                <input className='inputs1' placeholder='생년월일(YYYYMMDD)' value={birth} onChange={onBirthChangeHandler}
                    maxLength={8} />
                <div className={birthMsgBool ? 'message-true' : 'message-false'}>{birthMessage}</div>

                <div className='gender-box'>
                    <div
                        onClick={() => { selectedGenderClickHandler('여') }}
                        className={selectedGender === '여' ? 'selected' : 'unselected'}
                    >여성</div>
                    <div
                        onClick={() => { selectedGenderClickHandler('남') }}
                        className={selectedGender === '남' ? 'selected' : 'unselected'}
                    >남성</div>
                </div>

                <div className='box-test'>
                    <input className='inputs' placeholder='전화번호를 입력해주세요' value={displayFormattedPhoneNumber(telNumber)} onChange={onTelNumberChangeHandler} />
                    <div className='send-button' onClick={onSendClickHandler}>{isMatched3 ? '재전송' : '전화번호 인증'}</div>
                </div>
                <div className={isMatched1 ? 'message-true' : 'message-false'}>{telMessage}</div>

                {isMatched1 &&
                    <div>
                        <div className='box-test'>
                            <div className='input-wrapper'>
                                <input className='inputs' placeholder='인증번호 4자리' onKeyDown={handleKeyDown} value={telAuthNumber} onChange={onAuthNumberChangeHandler} readOnly={isMatched2} />
                                <div className='timer'>{formatTime()}</div>
                            </div>
                            <div className='send-button' onClick={onCheckClickHandler}>인증 확인</div>
                        </div>
                        <div className={isMatched2 ? 'message-true' : 'message-false'}>{authMessage}</div>
                    </div>
                }

                <div className='user-permission'>

                    <div className='permission-box'>
                        <input type="checkbox" id='all' checked={allChecked} onChange={handleAllChecked} />
                        <label htmlFor="all">약관 전체 동의</label>
                    </div>
                    <hr className='hr-custom-three' />

                    <div className='permission-box-detail'>
                        <input type="checkbox"
                            id="service"
                            name="service"
                            checked={terms.service}
                            onChange={handleTermChange} />
                        <label htmlFor="service" className="permission-label">[필수] 이용약관 동의</label>
                        <button type="button"
                            onClick={toggleServiceTerms1}
                            className={`toggle-button ${showServiceTerms ? 'rotate' : ''}`}>
                            ▼
                        </button>
                    </div>
                    {showServiceTerms && (
                        <div style={{ paddingLeft: '40px', marginTop: '8px', color: '#666' }}>
                            <p className='service-contents'>{`제 1조 (목적)
이 약관은 The Memorial Day (이하 "갑"이라 합니다)가 제공하는 서비스(이하 "서비스"라 합니다)를 이용함에 있어, 고객(이하 "을"이라 합니다)과 갑 간의 권리, 의무, 책임 사항 및 기타 필요한 사항을 규정함을 목적으로 합니다.

제 2조 (용어 정의)
"갑"이라 함은 The Memorial Day를 의미하며, 서비스 제공 주체를 말합니다.
"을"이라 함은 본 약관에 동의하고 서비스를 이용하는 고객을 의미합니다.
"서비스"라 함은 갑이 제공하는 일체의 콘텐츠, 정보, 상품 및 관련 서비스를 의미합니다.

제 3조 (약관의 명시와 개정)
갑은 본 약관의 내용을 을이 쉽게 알 수 있도록 서비스 초기 화면에 게시하거나 기타 방법으로 공지합니다.
갑은 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있으며, 개정된 약관은 서비스 화면에 게시하거나 기타 방법으로 공지함으로써 효력을 발생합니다.

제 4조 (서비스의 제공 및 변경)
갑은 을에게 아래와 같은 서비스를 제공합니다:
케이크 주문 제작 및 기타 서비스
관련 정보 제공 및 맞춤 추천 서비스
기타 갑이 정하는 서비스
갑은 서비스 내용이 변경될 경우, 변경 내용을 을에게 사전 통지하며, 불가피한 사정이 있는 경우에는 통지 없이 변경할 수 있습니다.

제 5조 (서비스 이용 요금)
서비스 이용에 필요한 비용이 있을 경우, 갑은 해당 요금을 사전에 공지하며, 을은 이에 따라 요금을 부담합니다.
갑은 별도의 사전 통지 없이 서비스 요금을 변경할 수 있으며, 변경된 요금은 이후 서비스 이용 시 적용됩니다.

제 6조 (이용자의 의무)
을은 본 약관, 관련 법령 및 공공질서에 반하는 행위를 하여서는 안 됩니다.
을은 갑의 사전 허락 없이 갑의 서비스를 영리 목적으로 이용하거나 제3자에게 양도, 대여할 수 없습니다.
을은 자신의 계정 정보 및 개인정보를 제3자에게 양도 또는 공개하지 않으며, 이로 인해 발생한 책임은 을에게 있습니다.

제 7조 (갑의 의무)
갑은 관련 법령과 본 약관에 따라 지속적이고 안정적인 서비스를 제공하기 위해 최선을 다합니다.
갑은 개인정보 보호법 등 관련 법령을 준수하며, 을의 개인정보 보호를 위해 노력합니다.
갑은 서비스 제공과 관련하여 을이 제기한 정당한 의견이나 불만이 있을 경우 이를 성실히 처리합니다.

제 8조 (서비스 중단)
갑은 아래와 같은 사유가 발생한 경우 서비스 제공을 일시적으로 중단할 수 있습니다:
시스템 정비, 교체, 업그레이드 등의 경우
서비스의 이용이 현저히 곤란한 경우
서비스 중단에 대해 갑은 을에게 사전 통지하며, 사전 통지가 어려울 경우에는 사후에 통지합니다.

제 9조 (책임의 제한)
갑은 천재지변, 전쟁, 기타 불가항력으로 인해 발생한 서비스 중단에 대해서는 책임을 지지 않습니다.
갑은 을이 서비스에 포함된 정보에 의존하여 발생한 손해에 대해서는 책임을 지지 않습니다.
갑은 을의 귀책사유로 인해 발생한 손해에 대해서는 책임을 지지 않습니다.

제 10조 (개인정보 보호)
갑은 을의 개인정보를 서비스 제공의 목적 범위 내에서만 수집, 이용하며, 을의 동의 없이 제3자에게 제공하지 않습니다.
갑은 개인정보 보호법을 준수하여 을의 개인정보를 안전하게 관리합니다.

제 11조 (분쟁 해결)
본 약관과 관련하여 갑과 을 사이에 발생한 분쟁에 대해서는 상호 협의하여 해결을 도모합니다.
협의가 이루어지지 않을 경우, 관련 법령에 따른 절차에 따라 분쟁을 해결합니다.
부칙
본 약관은 2024년 11월 12일부터 시행됩니다.`}</p>
                        </div>
                    )}


                    <div className='permission-box-detail'>
                        <input type="checkbox"
                            id="privacy"
                            name="privacy"
                            checked={terms.privacy}
                            onChange={handleTermChange} />
                        <label htmlFor="privacy" className="permission-label">[필수] 개인정보 수집 및 이용 동의</label>
                        <button type="button"
                            onClick={toggleServiceTerms2}
                            className={`toggle-button ${showPrivacyTerms ? 'rotate' : ''}`}>
                            ▼
                        </button>
                    </div>
                    {showPrivacyTerms && (
                        <div style={{ paddingLeft: '40px', marginTop: '8px', color: '#666' }}>
                            <p className='service-contents'>{`제 1조 (목적)
The Memorial Day (이하 "갑")는 고객(이하 "을")의 개인정보를 중요하게 여기며, 관련 법령에 따라 개인정보를 보호하고 있습니다. 본 약관은 을이 갑의 서비스를 이용함에 있어 갑이 수집한 개인정보의 이용, 보관, 보호 및 파기에 관한 기본적인 사항을 규정함을 목적으로 합니다.

제 2조 (개인정보 수집 항목 및 수집 방법)
갑은 서비스 제공을 위해 필요한 최소한의 개인정보를 수집합니다.
수집하는 개인정보 항목: 필수항목: 성명, 연락처(전화번호), 서비스 이용 기록, 성별, 생년월일 등
개인정보 수집 방법: 홈페이지, 서면 양식, 전화, 이메일 등을 통한 직접 수집 및 자동 수집 장치에 의한 수집

제 3조 (개인정보의 수집 및 이용 목적)
갑은 수집한 개인정보를 다음과 같은 목적을 위해 활용합니다.

서비스 제공 및 서비스 이용에 따른 본인 확인
고객 관리: 고객 지원, 불만 처리 및 공지사항 전달
마케팅 및 광고 활용: 맞춤형 서비스 제공 및 이벤트 정보 안내
통계 분석을 통한 서비스 품질 개선

제 4조 (개인정보 보유 및 이용 기간)
갑은 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
다만, 다음의 정보는 보관 기간 동안 보관합니다:
계약 및 청약 철회, 결제, 서비스 제공 등 거래 관련 기록: 5년 (전자상거래 등에서의 소비자 보호에 관한 법률에 의한 보관)
소비자 불만 및 분쟁 처리에 관한 기록: 3년
표시/광고에 관한 기록: 6개월

제 5조 (개인정보의 제3자 제공)
갑은 을의 사전 동의 없이는 개인정보를 제3자에게 제공하지 않습니다.
다만, 다음의 경우는 예외로 합니다:
을이 사전에 동의한 경우
법령에 의해 요구되는 경우
수사 목적으로 법령에 따라 수사기관의 요청이 있는 경우

제 6조 (개인정보 처리의 위탁)
갑은 서비스 향상을 위해 개인정보 처리를 외부에 위탁할 수 있으며, 위탁 시 을의 개인정보 보호가 충분히 보장될 수 있도록 관리 및 감독합니다.
개인정보 처리 위탁을 받은 제3자는 다음과 같습니다:
위탁 대상: [The Memorial Day 데이터 반]
위탁 내용: 고객 지원, 데이터 처리 및 보관

제 7조 (이용자의 권리 및 행사 방법)
을은 갑이 보유한 개인정보에 대해 열람, 정정, 삭제, 처리 정지 등을 요구할 권리가 있습니다.
권리 행사는 서면, 이메일, 고객센터 등을 통해 요청할 수 있으며, 갑은 이를 지체 없이 처리합니다.

제 8조 (개인정보 보호를 위한 기술적, 관리적 조치)
갑은 을의 개인정보 보호를 위해 다음과 같은 조치를 취합니다:
기술적 조치: 데이터 암호화, 백신 프로그램 설치 및 관리
관리적 조치: 개인정보 취급 직원에 대한 정기 교육, 접근 권한 관리 등

제 9조 (개인정보 파기 절차 및 방법)
갑은 개인정보의 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
파기 절차 및 방법은 다음과 같습니다:
전자적 파일 형태의 정보는 기술적 방법을 사용하여 복구할 수 없도록 영구 삭제합니다.
서면 형태의 정보는 분쇄하거나 소각하여 파기합니다.

제 10조 (개인정보 처리방침의 개정)
본 개인정보 처리방침은 관련 법령이나 갑의 정책 변경에 따라 개정될 수 있습니다.
개정 시 변경 사항은 홈페이지를 통해 공지되며, 을은 변경된 정책에 동의하지 않을 경우 서비스 이용을 중단하고 회원 탈퇴를 요청할 수 있습니다.

제 11조 (문의처)
본 개인정보 처리방침에 관한 문의사항은 아래를 통해 문의해주시기 바랍니다.

고객센터: [010-1234-5678]
이메일: [rpaeheh@naver.com]]
주소: [부산광역시 부산진구 중앙대로 668]`}</p>
                        </div>
                    )}
                </div>

                <div className='signup-button' onClick={signUpClickHandler}>회원가입</div>
            </div>
        </div>
    )
}