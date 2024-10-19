//# 장바구니 정보 리스트 타입 정의

export default interface ShoppingCart {
	cartNumber: number;
	productNumber: number;
	userId: string;
	productCount: number;
	totalPrice: number;
}