import React from 'react';
import { FullOrder } from '../../apis/dto/response/sales/get-sales.response.dto';

interface CompletedOrderProps {
    order: FullOrder;
}

const formatOrderTime = (orderTime: string) => {
    // 날짜 형식 변환
    const date = new Date(orderTime);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}.${month}.${day}`;
}

const CompletedOrder: React.FC<CompletedOrderProps> = ({ order }) => (
    <div className='completed-box'>
        <div className='top'>
            <div className='order-status'>{order.orderStatus}</div>
            <div className='order-code'>주문 코드: {order.orderCode}</div>
        </div>

        <div>
            <div className='main'>
                <div className='image'>
                    <img src={order.productImageUrl} alt={order.productName} />
                </div>
                <div className='order-info'>
                    <div className='pick-up-date'>주문 일자: {formatOrderTime(order.orderTime)}</div>
                    <div className='pick-up-date'>픽업 일시: {order.pickupTime}</div>
                    <div className='product-name'>상품: {order.productName}</div>
                    <div className='option-info'>
                        옵션: {order.options.map(opt => `${opt.productCategory}`).join(', ')}
                    </div>
                </div>
                <div className='order-price'>금액: {order.totalPrice.toLocaleString()} 원</div>
            </div>
        </div>
    </div>
);

export default CompletedOrder;
