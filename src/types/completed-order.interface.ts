// interface: 픽업 완료된 주문 정보 리스트 //

export default interface CompletedOrderProps {
	orderStatus: string;
	orderCode: string;
	pickUpTime: string;
	productName: string;
	optionNumber: string;
	name: string;
	telNumber: string;
	totalPrice: number;
}