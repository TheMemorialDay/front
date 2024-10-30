// interface: post product request Body dto

export interface PostProductOptionDetailRequestDto {
    productCategory: string;
    productOptionPrice: number;
}

export interface PostProductOptionRequestDto {
    productOptionName: string;
    optionDetails: PostProductOptionDetailRequestDto[];
}

export interface PostProductRequestDto {
    productName: string;
    productIntroduce?: string;
    productPrice: number;
    productToday: boolean;
    productTag: string;
    options: PostProductOptionRequestDto[];
    productImages: string[];
    themes: string[];
}
