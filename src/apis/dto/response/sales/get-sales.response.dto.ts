export interface Option {
    optionCategoryNumber: number;
    productCategory: string;
}

export interface FullOrder {
    orderCode: string;
    orderStatus: string;
    orderTime: string;
    storeNumber: number;
    storeName: string;
    productName: string;
    productContents: string;
    pickupTime: string;
    totalPrice: number;
    productImageUrl: string;
    options: Option[];
}
