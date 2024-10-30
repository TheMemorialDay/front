import axios, { AxiosResponse } from 'axios';
import {PostProductRequestDto, PostProductOptionDetailRequestDto, PostProductOptionRequestDto} from './dto/request/product/post-product-request.dto'; // DTO import
import ResponseDto from './dto/response/response.dto';
import { GetProductListResponseDto, GetProductResponseDto } from './dto/response/product';

// variable: API URL 상수 //
const THEMEMORIALDAY_API_DOMAIN = process.env.REACT_APP_APT_URL;

const PRODUCT_MODULE_URL = `${THEMEMORIALDAY_API_DOMAIN}/mypage/product`;

const POST_PRODUCT_API_URL = `${PRODUCT_MODULE_URL}`;
const GET_PRODUCT_LIST_API_URL = `${PRODUCT_MODULE_URL}`;
const GET_PRODUCT_API_URL = (productNumber: number | string) => `${PRODUCT_MODULE_URL}/${productNumber}`;
// const PATCH_PRODUCT_API_URL = (productNumber: number | string) => `${PRODUCT_MODULE_URL}/${productNumber}`;
// const DELETE_PRODUCT_API_URL = (productNumber: number | string) => `${PRODUCT_MODULE_URL}/${productNumber}`;


// function: Authorizarion Bearer 헤더 //
const bearerAuthorization = (accessToken: string) => ({ headers: { 'Authorization': `Bearer ${accessToken}` } })

// function: response data 처리 함수 //
const responseDataHandler = <T>(response: AxiosResponse<T, any>) => {
    const { data } = response;
    return data;
};

// function: response error 처리 함수 //
const responseErrorHandler = (error:any) => {
    if (error.response) {
        // 서버가 응답을 반환한 경우
        console.error("API 응답 오류:", error.response.data);
        return error.response.data;
    } else if (error.request) {
        // 요청이 이루어졌지만 응답이 없는 경우
        console.error("응답 없음:", error.request);
    } else {
        // 오류가 발생한 요청 설정
        console.error("오류 발생:", error.message);
    }
    return null; // 기본 반환값
};

// // function: post product 요청 함수 //
// export const postProductRequest = async (requestBody: PostProductRequestDto, accessToken: string) => {
//     const responseBody = await axios.post(POST_PRODUCT_API_URL, requestBody, bearerAuthorization(accessToken))
//         .then(responseDataHandler<ResponseDto>)
//         .catch(responseErrorHandler);
//     return responseBody;
// };

// function: post product 요청 함수 //                              토큰 인증 관련 지우고 임의로 진행(원래는 위와 같이 작성)
// export const postProductRequest = async (requestBody: PostProductRequestDto) => {
//     const responseBody = await axios.post(POST_PRODUCT_API_URL, requestBody)
//         .then(responseDataHandler<ResponseDto>)
//         .catch(responseErrorHandler);
//     return responseBody;
// };

export const postProductRequest = async (requestBody: PostProductRequestDto, storeNumber: number | string) => {
    try {
        // const response = await axios.post(POST_PRODUCT_API_URL, requestBody);
        const response = await axios.post(`${THEMEMORIALDAY_API_DOMAIN}/mypage/product/${storeNumber}`, requestBody);

        return responseDataHandler<ResponseDto>(response);
    } catch (error) {
        const errorData = responseErrorHandler(error);
        throw errorData;
    }
};

// export const postProductRequest = async (requestBody: PostProductRequestDto) => {        원래 이렇게 쓰는 게 정석
//     // const response = await axios.post(POST_PRODUCT_API_URL, requestBody);
//     const responseBody = await axios.post(`${THEMEMORIALDAY_API_DOMAIN}/mypage/product/add`, requestBody)
//         .then(responseDataHandler<ResponseDto>)
//         .catch(responseErrorHandler)
//         return responseBody;
// };


// export const getProductListRequest = async (accessToken: string) => {
//     const responseBody = await axios.get(`${THEMEMORIALDAY_API_DOMAIN}/mypage/product`, bearerAuthorization(accessToken))
//         .then(responseDataHandler<GetProductListResponseDto>)
//         .catch(responseErrorHandler);
//     return responseBody;
// };
// function: get product list 요청 함수 //                               토큰 인증 관련 지우고 임의로 진행(원래는 위와 같이(63~68) 작성)

// getProductListRequest.ts
export const getProductListRequest = async (userId: string): Promise<GetProductListResponseDto | null> => {
    try {
        const response = await axios.get(`${THEMEMORIALDAY_API_DOMAIN}/mypage/product/${userId}`);
        return responseDataHandler<GetProductListResponseDto>(response); // 일단 에러 해결때문에 이렇게 작성
    } catch (error) {
        responseErrorHandler(error);
        return null; // 오류 발생 시 null 반환
    }
};



// // function: post product option 요청 함수
// export const postProductOptionRequest = async (requestBody: PostProductOptionRequestDto) => {
//     const responseBody = await axios.post(POST_PRODUCT_OPTION_API_URL, requestBody)
//         .then(responseDataHandler<ResponseDto>)
//         .catch(responseErrorHandler);
//     return responseBody;
// };

// // function: post product option detail 요청 함수
// export const postProductOptionDetailRequest = async (requestBody: PostProductOptionDetailRequestDto) => {
//     const responseBody = await axios.post(POST_PRODUCT_OPTION_DETAIL_API_URL, requestBody)
//         .then(responseDataHandler<ResponseDto>)
//         .catch(responseErrorHandler);
//     return responseBody;
// };

// // function: get product list 요청 함수 //
// export const getProductListRequest = async (accessToken: string) => {
//     const responseBody = await axios.get(GET_PRODUCT_LIST_API_URL, bearerAuthorization(accessToken))
//         .then(responseDataHandler<GetProductListResponseDto>)
//         .catch(responseErrorHandler);
//     return responseBody;
// };

// // // function: get product 요청 함수 //
// export const getProductRequest = async (productNumber: number | string, accessToken: string) => {
//     const responseBody = await axios.get(GET_PRODUCT_API_URL(productNumber), bearerAuthorization(accessToken))
//         .then(responseDataHandler<GetProductResponseDto>)
//         .catch(responseErrorHandler);
//     return responseBody;
// };


// function: get product 요청 함수 //                                       로그인 끝나면 위와 같이 수정(토큰 포함)
export const getProductRequest = async (productNumber: number | string): Promise<GetProductResponseDto | null> => {
    try {
        const response = await axios.get(`${THEMEMORIALDAY_API_DOMAIN}/mypage/product/update/${productNumber}`);
        return responseDataHandler<GetProductResponseDto>(response);
    } catch (error) {
        responseErrorHandler(error);
        return null; // 오류 발생 시 null 반환
    }
};

// function: patch product 요청 함수 //

export const patchProductRequest = async (productNumber: number | string, data: PostProductRequestDto): Promise<any> => {
    try {
        const response = await axios.patch(`${THEMEMORIALDAY_API_DOMAIN}/mypage/product/${productNumber}`, data);
        return responseDataHandler(response); // 응답 처리
    } catch (error) {
        responseErrorHandler(error);
        return null;
    }
};

const FILE_UPLOAD_URL = `${THEMEMORIALDAY_API_DOMAIN}/file/upload`;

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

// function: file upload 요청 함수 //
export const fileUploadRequest = async (requestBody: FormData) => {
    const url = await axios.post(FILE_UPLOAD_URL, requestBody, multipart)
        .then(responseDataHandler<string>)
        .catch(error => null);
    return url;
};