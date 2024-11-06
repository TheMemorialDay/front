// interface: 픽업 완료된 주문 정보 리스트 //

export default interface OrderDetailsProps {
	orderCode: string;
	productNumber: number;
	storeNumber: number;
	userId: string;
	productContents: string | null;
	pickUpTime: string;
	orderStatus: string;
	productCount: number;
	totalPrice: number;
	orderTime: string;
	cancelCode: string | null;
	cancelReason: string | null;
	optionSelect: string;
}