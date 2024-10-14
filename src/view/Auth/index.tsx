import React, { useState } from 'react'
import './style.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SIGN_UP_ABSOLUTE_PATH } from '../../constants';


type AuthPath = 'signUp' | 'logIn' | 'findId' | 'findIdResult' | 'findPassword' | 'changePassword';
interface AuthComponentProps {
    onPathChange: (path: AuthPath) => void;
  }

// component: 로그인 화면 컴포넌트 //
function SignIn({onPathChange}: AuthComponentProps) {

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 회원가입 클릭 이벤트 핸들러 //
    const signUpClickHandler = () => {
        navigator(SIGN_UP_ABSOLUTE_PATH);
    }

    //render: 로그인 화면 컴포넌트 렌더링 //
    return (
            <div id='signIn'>
                <div className='auth-title'>로그인</div>
                <div className='login-box'>
                    <input className='input-id' placeholder='아이디'></input>
                    <input className='input-id' placeholder='비밀번호'></input>
                    <div className='message' style={{alignSelf: "stretch"}}>로그인 정보가 일치하지 않습니다.</div>
                </div>
                <div className='login-button'>로그인</div>
                <hr className='hr-custom'/>
                <div className='etc-function'>
                    <div className='find' onClick={()=> onPathChange('findId')}>아이디 찾기</div>
                    <div>|</div>
                    <div className='find' onClick={()=> onPathChange('findPassword')}>비밀번호 찾기</div>
                    <div>|</div>
                    <div className='find' onClick={signUpClickHandler}>회원가입</div>
                </div>
                <div className='sns-container'>
                    
                    <div className='kakao'></div>
                    <div className='naver'></div>
                    <div className='google'></div>
                </div>
            </div>
    )
}

// component: 아이디 찾기 화면 컴포넌트 //
function FindId({onPathChange}: AuthComponentProps) {

    //render: 아이디 찾기 화면 렌더링 //
    return (
        <div id='find-id'>
            <div className='auth-title'>아이디 찾기</div>
            <div className='login-box'>
                <input className='input-id' placeholder='이름'></input>
                <div className='tel'>
                    <input className='tel-number' placeholder='전화번호 – 빼고 입력해주세요.'/>
                    <div className='send-button'>전송</div>
                </div>
                <div className='message' style={{alignSelf: "stretch"}}>전화번호 11자리 입력해주세요.</div>
                <div className='tel' style={{marginTop: '20px'}}>
                    <input className='tel-number' placeholder='인증번호 4자리'/>
                    <div className='send-button'>확인</div>
                </div>
                <div className='message' style={{alignSelf: "stretch"}}>인증번호가 일치하지 않습니다.</div>
            </div>
            <div className='login-button' onClick={()=> onPathChange('findIdResult')}>아이디 찾기 확인</div>
        </div>
    )
}

// component: 아이디 찾기 결과 화면 컴포넌트 //
function FindIdResult({onPathChange}: AuthComponentProps) {

    //render: 아이디 찾기 결과 화면 렌더링 //
    return (
        <div id='find-id-result'>
            <div className='auth-title'>아이디 찾기 결과</div>
            <div className='login-box'>
                <div className='one-line'>
                    <div className='name'>이름</div>
                    <div className='name-result'>홍길동</div>
                </div>
                <div className='one-line'>
                    <div className='telNumber'>전화번호</div>
                    <div className='telNumber-result'>010-1234-5678</div>
                </div>
                <div className='one-line'>
                    <div className='id'>아이디</div>
                    <div className='id-result'>qwer1234</div>
                </div>
            </div>
            <div className='login-button' onClick={()=> onPathChange('logIn')}>로그인</div>
            <div className='login-button-2' onClick={()=> onPathChange('findPassword')}>비밀번호 찾기</div>
        </div>
    )
}

// component: 비밀번호 찾기 화면 컴포넌트 //
function FindPassword({onPathChange}: AuthComponentProps) {

    //render: 비밀번호 찾기 화면 렌더링 //
    return (
        <div id='find-password'>
            <div className='auth-title'>비밀번호 찾기</div>
            <div className='login-box'>
                <input className='input-id' placeholder='아이디'></input>
                <div className='tel'>
                    <input className='tel-number' placeholder='전화번호 – 빼고 입력해주세요.'/>
                    <div className='send-button'>전송</div>
                </div>
                <div className='message' style={{alignSelf: "stretch"}}>전화번호 11자리 입력해주세요.</div>
                <div className='tel' style={{marginTop: '20px'}}>
                    <input className='tel-number' placeholder='인증번호 4자리'/>
                    <div className='send-button'>확인</div>
                </div>
                <div className='message' style={{alignSelf: "stretch"}}>인증번호가 일치하지 않습니다.</div>
            </div>
            <div className='login-button' onClick={()=> onPathChange('changePassword')}>비밀번호 재설정</div>
        </div>
    )
}

// component: 비밀번호 재설정 화면 컴포넌트 //
function ChangePassword({onPathChange}: AuthComponentProps) {

    // event handler: 비밀번호 재설정 이벤트 핸들러 //
    // const onChangePasswordButtonClickHandler = ({onPathChange}: AuthComponentProps) => {
    
    // }

    // render: 비밀번호 재설정 화면 렌더링 //
    return (
        <div id='change-password'>
            <div className='auth-title'>비밀번호 재설정</div>
            <div className='login-box'>
                <input className='input-id' placeholder='비밀번호 (영문+숫자 8~13자)'/>
                <div className='message' style={{alignSelf: "stretch"}}>영문, 숫자를 혼용하여 8~13자 입력해주세요.</div>
                <input className='input-id' placeholder='비밀번호 확인'/>
                <div className='message' style={{alignSelf: "stretch"}}>비밀번호가 일치하지 않습니다.</div>
            </div>
            <div className='login-button' onClick={()=> onPathChange('logIn')}>비밀번호 변경</div>
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
                    path === 'logIn'? <SignIn onPathChange={onPathChangeHandler}/> : 
                    path === 'findId' ? <FindId onPathChange={onPathChangeHandler}/> :
                    path === 'findIdResult' ? <FindIdResult onPathChange={onPathChangeHandler}/> :
                    path === 'findPassword' ? <FindPassword onPathChange={onPathChangeHandler}/> :
                    path === 'changePassword' ? <ChangePassword onPathChange={onPathChangeHandler}/> : ''
                }
            </div>
        </div>
    )
}
