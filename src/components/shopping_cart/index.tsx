import { useNavigate } from "react-router-dom";
import { ShoppingCartList } from "../../types";
import './style.css';
import { ST_ABSOLUTE_ORDER_DETAIL_PATH } from "../../constants";

// interface: 장바구니 아이템 리스트 //
interface CartBoxProps {
    shoppingCart: ShoppingCartList;
}

// component: 장바구니 상자 컴포넌트 //
export default function CartBox() {

    // function: 네비게이터 //
    const navigator = useNavigate();

    // event handler: 상자 클릭 시 해당 가게 상세 페이지로 이동 //
    const onItemDetailClickHandler = (path: string) => {
        navigator(path);
    };

    // render: 장바구니 상자 컴포넌트 렌더링 //
    return (
        <div className='cart-box' >
            <div className='image'></div>
            <div className='cart-info'>
                <div className='product-name'>부산 케이크</div>
                <div className='product-info'>
                    <div>부드러운 초코 케이크</div>
                    <div>옵션 1호, 초코, 요청사항 없음, 1개</div>
                    <div>픽업 일시 2024.11.01</div>
                </div>
            </div>
            <div className='total-count'>금액 33,000</div>
        </div>
    )

}