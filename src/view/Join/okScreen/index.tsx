import React from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom'
import { MY_STORE_ABSOLUTE_PATH, ROOT_ABSOLUTE_PATH } from '../../../constants';

// component: 등록 완료 화면 컴포넌트 //
function OkScreen() {

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 확인 버튼 클릭 이벤트 핸들러 //
    const onClickHandler = () => {
        navigator(ROOT_ABSOLUTE_PATH);
        window.location.reload();
    }

    // event handler: 확인 버튼 클릭 이벤트 핸들러 //
    const onClickHandler2 = () => {
        //navigator();
        // 나중에 가게 불러오기가 바로 안되면 마이페이지까지 이동하는 걸로 변경하기
        window.location.reload();
    }

    // render: 등록 완료 화면 렌더링 //
    return (
        <div id='ok'>
            <div className='emoji'></div>
            <div className='contents'>
                <div className='big'>사업자 등록 진위 확인 완료!</div>
                <div className='small'>
                    <div>마이페이지로 이동 후</div>
                    <div>가게 상세 정보를 입력해주세요.</div>
                </div>
            </div>

            <div style={{display: "flex", flexDirection: "row", gap: "15px"}}>
                <div className='button-box' onClick={onClickHandler}>나중에</div>
                {/* <div className='button-box' onClick={onClickHandler2}>확인</div> */}
            </div>
            
        </div>
    )
}

export default function OkayScreen() {
  return (
    <OkScreen />
  )
}
