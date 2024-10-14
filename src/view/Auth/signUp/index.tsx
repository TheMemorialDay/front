import React, { useState } from 'react'
import './style.css';

// component: 회원가입 화면 컴포넌트 //
export default function SignUp() {
    
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
                    <input className='inputs' placeholder='아이디'/>
                    <div className='send-button'>중복 확인</div>
                </div>
                <div className='message' style={{alignSelf: "stretch"}}>이미 사용 중인 아이디가 있습니다.</div>

                <input className='inputs1' placeholder='비밀번호 (영문+숫자 8~13자)'/>
                <div className='message' style={{alignSelf: "stretch"}}>영문, 숫자를 혼용하여 8~13자 입력해주세요.</div>

                <input className='inputs1' placeholder='비밀번호 확인'/>
                <div className='message' style={{alignSelf: "stretch"}}>비밀번호가 일치하지 않습니다.</div>

                <input className='inputs1' placeholder='이름' style={{marginBottom:"20px"}}/>

                <input className='inputs1' placeholder='생년월일(YYYYMMDD)'/>
                <div className='message' style={{alignSelf: "stretch"}}>일치하지 않는 형식입니다.</div>

                <div className='gender-box'>
                    <div className='woman'>여성</div>
                    <div className='woman'>남성</div>
                </div>

                <div className='box-test'>
                    <input className='inputs' placeholder='전화번호 – 빼고 입력해주세요'/>
                    <div className='send-button'>전화번호 인증</div>
                </div>
                <div className='message' style={{alignSelf: "stretch"}}>전화번호 11자리 입력해주세요.</div>

                <div className='box-test'>
                    <input className='inputs' placeholder='인증번호 4자리'/>
                    <div className='send-button'>인증 확인</div>
                </div>
                <div className='message' style={{alignSelf: "stretch", color: "green"}}>인증번호가 일치합니다.</div>

            </div>
        </div>
    )
}