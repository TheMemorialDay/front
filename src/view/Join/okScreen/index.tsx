import React from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom'
import { ROOT_ABSOLUTE_PATH } from '../../../constants';

// component: 등록 완료 화면 컴포넌트 //
function OkScreen() {

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 확인 버튼 클릭 이벤트 핸들러 //
    const onClickHandler = () => {
        navigator(ROOT_ABSOLUTE_PATH);
    }

    // render: 등록 완료 화면 렌더링 //
    return (
        <div id='ok'>
            <div className='emoji'></div>
            <div className='contents'>
                <div className='big'>가게 등록 요청이 완료되었습니다.</div>
                <div className='small'>
                    <div>사업 등록증 진위 확인을 기다려 주세요.</div>
                    <div>3 ~4일 뒤, 휴대폰 메시지로 알려드릴게요!</div>
                </div>
            </div>
            <div className='button-box' onClick={onClickHandler}>확인</div>
        </div>
    )
}

export default function OkayScreen() {
  return (
    <OkScreen />
  )
}
