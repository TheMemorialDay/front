// interface: 픽업 완료된 주문 정보 리스트 //

export default interface OrderDetailsProps {
    orderCode: string;
    productNumber: number;
    productName: string;
    storeNumber: number;
    storeName: string;
    userId: string;
    productContents: string | null;
    pickupTime: string;
    orderStatus: string;
    productCount: number;
    totalPrice: number;
    orderTime: string;
	productImageUrl: string;
    // productCategory: string;
    cancelCode: string | null;
    cancelReason: string | null;
    optionSelect: string;

    // options 필드 추가
    options: Array<{
        optionCategoryNumber: number;
        productCategory: string;
    }>;
}
