// interface: post order request Body dto

// 주문 옵션 요청 DTO
export interface PostOrderSelectOptionRequestDto {
    optionCategoryNumber: number;
}

// 주문 요청 DTO
export interface PostOrderRequestDto {
    pickupTime: string;
    productCount: number;
    productContents: string;
    totalPrice: number;
    options: PostOrderSelectOptionRequestDto[];
}