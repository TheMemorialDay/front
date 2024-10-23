import React from 'react'

interface CompletedOrderProps {
	completedOrder: CompletedOrderProps;
}

// component: 픽업 완료 상자 컴포넌트 //
export default function CompletedOrder() {

	// render: 픽업 완료 상자 컴포넌트 렌더링 //
	return (
		<div className='completed-box'>
			<div className='top'>
				<div className='order-status'>픽업 완료</div>
				<div className='order-code'>주문 코드 2024101088888</div>
			</div>

			<div className='main'>
				<div className='image'></div>
				<div className='order-info'>
					<div className='pick-up-date'>픽업 일시 2024.10.10</div>
					<div className='product-name'>상품 부드러운 생크림 케이크</div>
					<div className='option-info'>옵션 1호, 바닐라, 요청사항: 없음</div>
					<div className='customer-info'>고객 정보 홍길동 / 010-5555-6666</div>
				</div>
				<div className='order-price'>금액 33,000</div>
			</div>
		</div>
	)
}
