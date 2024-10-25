import { useNavigate } from "react-router-dom";
import { MY_ORDER_DETAIL_ABSOLUTE_PATH, ROOT_ABSOLUTE_PATH } from "../../../../constants";
import './style.css';

// component: 등록 완료 화면 컴포넌트 //
function Done() {

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 주문 내역 확인 버튼 클릭 이벤트 핸들러 //
    const onCheckClickHandler = () => {
        navigator(MY_ORDER_DETAIL_ABSOLUTE_PATH);
    }

    // event handler: 둘러보기 버튼 클릭 이벤트 핸들러 //
    const onClickHandler = () => {
        navigator(ROOT_ABSOLUTE_PATH);
    }

    // render: 등록 완료 화면 렌더링 //
    return (
        <div id='order-done'>
            <div className='emoji'></div>
            <div className='contents'>
                <div className='big'>주문 요청이 완료되었습니다.</div>
                <div className='small'>
                    <div>사장님의 확인을 기다려주세요.</div>
                    <div>휴대폰 메시지로 알려드릴게요!</div>
                </div>
            </div>
            <div className="buttons">
                <div className="button-box" onClick={onCheckClickHandler}>주문 내역 확인</div>
                <div className="button-box" onClick={onClickHandler}>둘러보기</div>
            </div>
        </div>
    )
}

export default function DoneScreen() {
  return (
    <Done />
  )
}