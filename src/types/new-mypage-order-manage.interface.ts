// interface: 픽업 완료된 주문 정보 리스트 //

export default interface NewOrderDetailsProps {
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
    cancelCode: string | null;
    cancelReason: string | null;
    optionSelect: string;
    name: string;
    telNumber: string;
    photoUrl?: string;

    // options 필드 추가
    options: Array<{
        optionCategoryNumber: number;
        productCategory: string;
    }>;
}
