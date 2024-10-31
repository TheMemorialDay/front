// interface: patch product request Body dto

export interface PatchProductOptionDetailRequestDto {
    productCategory: string;
    productOptionPrice: number;
}

export interface PatchProductOptionRequestDto {
    productOptionName: string;
    optionDetails: PatchProductOptionDetailRequestDto[];
}

export interface PatchProductRequestDto {
    productName: string;
    productIntroduce?: string;
    productPrice: number;
    productToday: boolean;
    productTag: string;
    options: PatchProductOptionRequestDto[];
    productImages: string[];
    themes: string[];
}
