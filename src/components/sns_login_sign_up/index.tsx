import React from 'react'
import './style.css';

//# 로그인 & 회원가입 SNS

// component: sns 컴포넌트 //
export default function SnsContainer() {

	// event handler: SNS 버튼 클릭 시 SNS 로그인 창으로 이동 //
	const onSnsButtonClickHandler = (sns: 'kakao' | 'naver' | 'google') => {
		window.location.href = `${process.env.REACT_APP_API_URL}/api/v1/auth/sns-sign-in/${sns}`;
	};

	// render: sns 컴포넌트 렌더링 //
	return (
		<div className='sns-container'>
			<div className='kakao' onClick={() => onSnsButtonClickHandler('kakao')}></div>
			<div className='naver' onClick={() => onSnsButtonClickHandler('naver')}></div>
			<div className='google' onClick={() => onSnsButtonClickHandler('google')}></div>
		</div>
	)
}
