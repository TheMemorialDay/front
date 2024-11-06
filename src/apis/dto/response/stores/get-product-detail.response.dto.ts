import ResponseDto from "../response.dto";

export default interface GetProductDetailResponseDto extends ResponseDto {
    orderProductDetails: OrderProductDetails;
}

interface OrderProductDetails {
    productNumber: number;
    productName: string;
    productIntroduce: string;
    productPrice: number;
    productToday: boolean;
    productImages: string[];
    themes: string[];
    options: ProductOption[];
    storeCaution: string;

    mondayOpen: string;
    mondayLast: string;
    tuesdayOpen: string;
    tuesdayLast: string;
    wednesdayOpen: string;
    wednesdayLast: string;
    thursdayOpen: string;
    thursdayLast: string;
    fridayOpen: string;
    fridayLast: string;
    saturdayOpen: string;
    saturdayLast: string;
    sundayOpen: string;
    sundayLast: string;
}

interface ProductOption {
    optionNumber: any;
    productOptionName: string;
    optionDetails: OptionDetail[];
}

interface OptionDetail {
    productCategory: string;
    productOptionPrice: number;
}

