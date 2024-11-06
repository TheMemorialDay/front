import axios, { AxiosResponse } from 'axios';
import { PostProductRequestDto, PostProductOptionDetailRequestDto, PostProductOptionRequestDto } from './dto/request/product/post-product-request.dto'; // DTO import
import ResponseDto from './dto/response/response.dto';
import { GetProductListResponseDto, GetProductResponseDto } from './dto/response/product';
import { IdCheckRequestDto, PostLikeStoreRequestDto, PostPayMentRequestDto, SignInRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request";
import PostStoreRequestDto from "./dto/request/store/post-store.request.dto";
import { GetProductDetailResponseDto, GetProductPreviewListResponseDto, GetStoreListResponseDto, GetStoreResponseDto } from "./dto/response/stores";
import { GetSignInResponseDto } from "./dto/response/auth";
import { BusinessNumCheckRequestDto, PatchJoinRequestDto } from "./dto/request/join";
import { BusinessNumCheckResponseDto } from "./dto/response/join";
import { PatchStoreRequestDto } from "./dto/request/store";
import BusinessCheckRequestDto from "./dto/request/join/business-check.request.dto";
import ApiResponseDto from "./dto/response/join/api-response.dto";
import GetStoreNumber from './dto/response/product/get-store-number-response.dto';
import { access } from 'fs';
import { PostOrderRequestDto } from './dto/request/order';
import GetMyPageLikeStoreListResponseDto from './dto/response/like/get-mypage-likestore-list.response.dto';
import GetOrderDetailResponseDto from './dto/response/get-order-detail-response-dto';
import GetOrderDetailListResponseDto from './dto/response/get-order-detail-list.response.dto';
import { GetNoticeDetailResponseDto, GetNoticeListResponseDto, GetQnADetailResponseDto, GetQnAListResponseDto } from './dto/response/support';
import { PostQnARequestDto } from './dto/request/support';
import { URL } from 'url';


// variable: API URL 상수 //

const MEMORIALDAY_API_DOMAIN = process.env.REACT_APP_API_URL;

const PRODUCT_MODULE_URL = `${MEMORIALDAY_API_DOMAIN}/mypage/product`;

const POST_PRODUCT_API_URL = `${PRODUCT_MODULE_URL}`;
const GET_PRODUCT_LIST_API_URL = `${PRODUCT_MODULE_URL}`;
const GET_PRODUCT_API_URL = (productNumber: number | string) => `${PRODUCT_MODULE_URL}/${productNumber}`;
//const PATCH_PRODUCT_API_URL = (productNumber: number | string) => `${PRODUCT_MODULE_URL}/${productNumber}`;
const DELETE_PRODUCT_API_URL = (productNumber: number | string) => `${PRODUCT_MODULE_URL}/${productNumber}`;

const GET_STORE_LIST_API_URL = `${MEMORIALDAY_API_DOMAIN}/stores`;
const POST_LIKE_API_URL = `${MEMORIALDAY_API_DOMAIN}/stores`;
const DELETE_LIKE_API_URL = (userId: string, storeNumber: number | string) => `${POST_LIKE_API_URL}?userId=${userId}&storeNumber=${storeNumber}`;
const GET_PRODUCT_PREVIEW_LIST_API_URL = (storeNumber: number | string) => `${GET_STORE_LIST_API_URL}/${storeNumber}/order/list`
const GET_PRODUCT_DETAIL_API_URL = (storeNumber: number | string, productNumber: number | string) => `${GET_STORE_LIST_API_URL}/${storeNumber}/order/${productNumber}`;
const POST_ORDER_DETAIL_API_URL = (storeNumber: number | string, productNumber: number | string, userId: string) => `${GET_STORE_LIST_API_URL}/${storeNumber}/order/${productNumber}/${userId}`;

const MYPAGE_MODULE_URL = `${MEMORIALDAY_API_DOMAIN}/mypage`;
const GET_STORE_NUMBER_API_URL = (userId: string) => `${MEMORIALDAY_API_DOMAIN}/mypage/product/add/${userId}`;

const MYPAGE_STORE_MODULE = `${MYPAGE_MODULE_URL}/store`;

const PATCH_JOIN_URL = (userId: string | null) => `${MEMORIALDAY_API_DOMAIN}/join/${userId}`;

const POST_STORE_API_MODULE = `${MYPAGE_STORE_MODULE}`;
const GET_MYPAGE_STORE_API_URL = (storeNumber: number | string) => `${MYPAGE_STORE_MODULE}/${storeNumber}`;
const GET_MYPAGE_LIKE_STORE_API_URL = (userId: string) => `${MYPAGE_MODULE_URL}/like/${userId}`;
const PATCH_STORE_API_URL = (storeNumber: number | string) => `${MYPAGE_STORE_MODULE}/${storeNumber}`;

const GET_STORE_API_URL = (storeNumber: number | string) => `${GET_STORE_LIST_API_URL}/${storeNumber}`

const GET_ORDER_DETAIL_API_URL = (userId: string) => `${MYPAGE_MODULE_URL}/order-detail/${userId}`;

const AUTH_MODULE_URL = `${MEMORIALDAY_API_DOMAIN}/api/v1/auth`;

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;
const ID_SEARCH_API_URL = `${AUTH_MODULE_URL}/id-search`;
const GET_SIGN_IN_API_URL = `${AUTH_MODULE_URL}/get-sign-in`;

const POST_PAYMENT_API_URL = `${MYPAGE_MODULE_URL}/order-detail`;

const SUPPORT_API_URL = `${MEMORIALDAY_API_DOMAIN}/support`;
const SUPPORT_NOTICE_API_URL = `${SUPPORT_API_URL}/notice`;
const NOTICE_DETAIL_API_URL = (noticeNumber: string | number) => `${SUPPORT_NOTICE_API_URL}/${noticeNumber}`;

const SUPPORT_QNA_API_URL = `${SUPPORT_NOTICE_API_URL}/question`;
const QNA_DETAIL_API_URL = (questionNumber: number | string) => `${SUPPORT_QNA_API_URL}/${questionNumber}`;
const QNA_WRITE_API_URL = `${SUPPORT_QNA_API_URL}/write`;
const QNA_DELETE_API_URL = (questionNumber: number | string) => `${SUPPORT_QNA_API_URL}/${questionNumber}`;

// function: Authorizarion Bearer 헤더 //
const bearerAuthorization = (accessToken: string) => ({ headers: { 'Authorization': `Bearer ${accessToken}` } })

// function: response data 처리 함수 //
const responseDataHandler = <T>(response: AxiosResponse<T, any>) => {
    const { data } = response;
    return data;
};

// // function: post product 요청 함수 //
// export const postProductRequest = async (requestBody: PostProductRequestDto, accessToken: string) => {
//     const responseBody = await axios.post(POST_PRODUCT_API_URL, requestBody, bearerAuthorization(accessToken))
//         .then(responseDataHandler<ResponseDto>)
//         .catch(responseErrorHandler);
//     return responseBody;
// };

// function: get store number 요청 함수 //
export const getStoreNumberRequest = async (userId: string, accessToken: string) => {
    const responseBody = await axios.get(GET_STORE_NUMBER_API_URL(userId), bearerAuthorization(accessToken))
        .then(responseDataHandler<GetStoreNumber>)
        .catch(responseErrorHandler);
    return responseBody;
}


// function: post product 요청 함수 //                              토큰 인증 관련 지우고 임의로 진행(원래는 위와 같이 작성)
export const postProductRequest = async (requestBody: PostProductRequestDto, storeNumber: number | string, accessToken: string) => {
    try {
        // const response = await axios.post(POST_PRODUCT_API_URL, requestBody);
        const response = await axios.post(`${MEMORIALDAY_API_DOMAIN}/mypage/product/${storeNumber}`, requestBody, bearerAuthorization(accessToken));

        return responseDataHandler<ResponseDto>(response);
    } catch (error) {
        const errorData = responseErrorHandler(error);
        throw errorData;
    }
};

// function: get product list 요청 함수 //                               토큰 인증 관련 지우고 임의로 진행(원래는 위와 같이(63~68) 작성)

// getProductListRequest.ts
export const getProductListRequest = async (userId: string, accessToken: string): Promise<GetProductListResponseDto | null> => {
    try {
        const response = await axios.get(`${MEMORIALDAY_API_DOMAIN}/mypage/product/${userId}`, bearerAuthorization(accessToken));
        return responseDataHandler<GetProductListResponseDto>(response); // 일단 에러 해결때문에 이렇게 작성
    } catch (error) {
        responseErrorHandler(error);
        return null;
    }
};

// function: get product 요청 함수 //                                       로그인 끝나면 위와 같이 수정(토큰 포함)
export const getProductRequest = async (productNumber: number | string, accessToken: string): Promise<GetProductResponseDto | null> => {
    try {
        const response = await axios.get(`${MEMORIALDAY_API_DOMAIN}/mypage/product/update/${productNumber}`, bearerAuthorization(accessToken));
        return responseDataHandler<GetProductResponseDto>(response);
    } catch (error) {
        responseErrorHandler(error);
        return null;
    }
};

// function: patch product 요청 함수 //

export const patchProductRequest = async (productNumber: number | string, data: PostProductRequestDto, accessToken: string): Promise<any> => {
    try {
        const response = await axios.patch(`${MEMORIALDAY_API_DOMAIN}/mypage/product/${productNumber}`, data, bearerAuthorization(accessToken));
        return responseDataHandler(response);
    } catch (error) {
        responseErrorHandler(error);
        return null;
    }
};

// function: delete product 요청 함수 //
export const deleteProductRequest = async (productNumber: number | string, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_PRODUCT_API_URL(productNumber), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: response data 처리 함수 validate //
const responseDataHandler2 = <T extends ApiResponseDto>(response: AxiosResponse<T, any>) => {
    const { data } = response;
    if (data.status_code !== "OK") {
        return data.status_code;
    }

    // data 배열 내의 각 항목에 대해 valid 값 체크
    for (const item of data.data) {
        return item.valid;
    }

    // 위 조건에 해당하지 않는 경우 빈 문자열 반환
    return null; // string, null
};

// function: response data 처리 함수 status //
const responseDataHandler3 = <T extends BusinessNumCheckResponseDto>(response: AxiosResponse<T, any>) => {
    const { data } = response;
    if (data.status_code === 'OK') {
        const b_stt_cd = data.data[0].b_stt_cd;
        if(b_stt_cd == null) {
            const message = data.data[0].tax_type;
            console.log("메시지: " + message);
            return message;
        }else return b_stt_cd;
    }else return null;
    //return data.status_code;
};

// function: response error 처리 함수 //
const responseErrorHandler = (error: any) => {
    if (!error.response) return null;
    const { data } = error.response;
    return data as ResponseDto;
}


// function: id check api 요청 함수 //
export const idCheckRequest = async (requestBody: IdCheckRequestDto) => {
    const responseBody = await axios.post(ID_CHECK_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: tel auth api 요청 함수 //
export const telAuthRequest = async (requestBody: TelAuthRequestDto) => {
    const responseBody = await axios.post(TEL_AUTH_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: tel auth check api 요청 함수 //
export const telAuthCheckRequest = async (requestBody: TelAuthCheckRequestDto) => {
    const responseBody = await axios.post(TEL_AUTH_CHECK_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: sign up 요청 함수 //
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const responseBody = await axios.post(SIGN_UP_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: sign in 요청 함수 //
export const signInRequest = async (requestBody: SignInRequestDto) => {
    const responseBody = await axios.post(SIGN_IN_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: post Store 요청 함수 //
export const postStoreRequest = async (requestBody: PostStoreRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_STORE_API_MODULE, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: patch Store 요청 함수 //
export const patchStoreRequest = async (requestBody: PatchStoreRequestDto, storeNumber: number | string, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_STORE_API_URL(storeNumber), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get Store 요청 함수 //
export const getStoreRequest = async (storeNumber: number | string) => {
    const responseBody = await axios.get(GET_STORE_API_URL(storeNumber))
        .then(responseDataHandler<GetStoreResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get sign in 요청 함수 //
export const GetSignInRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_SIGN_IN_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetSignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get Store List 요청 함수 //
export const getStoreListRequest = async () => {
    const responseBody = await axios.get(GET_STORE_LIST_API_URL)
        .then(responseDataHandler<GetStoreListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get MyPage Store 요청 함수 //
export const getMyPageStoreRequest = async (storeNumber: number | string, accessToken: string) => {
    const responseBody = await axios.get(GET_MYPAGE_STORE_API_URL(storeNumber), bearerAuthorization(accessToken))
        .then(responseDataHandler<GetStoreResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get MyPage Like Store 요청 함수 //
export const getMyPageLikeStoreRequest = async (userId: string, accessToken: string) => {
    const responseBody = await axios.get(GET_MYPAGE_LIKE_STORE_API_URL(userId), bearerAuthorization(accessToken))
        .then(responseDataHandler<GetMyPageLikeStoreListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: patch join 요청 함수 //
export const patchJoinRequest = async (requestBody: PatchJoinRequestDto, userId: string, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_JOIN_URL(userId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: post Like Store 요청 함수 //
export const postLikeStoreRequest = async (requestBody: PostLikeStoreRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_LIKE_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: delete Like Store 요청 함수 //
export const deleteLikeStoreRequest = async (userId: string, storeNumber: number | string, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_LIKE_API_URL(userId, storeNumber), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: post Pay 요청 함수 //
export const postPayMentRequest = async (requestBody: PostPayMentRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_PAYMENT_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get Order Detail 요청 함수 //
export const getOrderDetailRequest = async (userId: string, accessToken: string) => {
    const responseBody = await axios.get(GET_ORDER_DETAIL_API_URL(userId), bearerAuthorization(accessToken))
        .then(responseDataHandler<GetOrderDetailListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get product list preview 요청 함수 //
export const getProductPreviewListRequest = async (storeNumber: string | number) => {
    const responseBody = await axios.get(GET_PRODUCT_PREVIEW_LIST_API_URL(storeNumber))
        .then(responseDataHandler<GetProductPreviewListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get product detail 요청 함수 //
export const getProductDetailRequest = async (storeNumber: string | number, productNumber: string | number) => {
    const responseBody = await axios.get(GET_PRODUCT_DETAIL_API_URL(storeNumber, productNumber))
        .then(responseDataHandler<GetProductDetailResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: post order 요청 함수 //
export const postOrderRequest = async (requestBody: PostOrderRequestDto, userId: string, storeNumber: number | string, productNumber: number | string, accessToken: string) => {
    try {
        const response = await axios.post(POST_ORDER_DETAIL_API_URL(storeNumber, productNumber, userId), requestBody, bearerAuthorization(accessToken));
        return responseDataHandler<ResponseDto>(response);
    } catch (error) {
        const errorData = responseErrorHandler(error);
        throw errorData;
    }
};

// API 요청 URL 및 serviceKey 설정
const serviceKey = '9tvM0W192uuqj1Wn7OdBwQLLdPvkYJNS450lJnvILRCNGbQoDXcihyDyQ/d/tx4Q78ii38jdMbWMeKB8ikiSVw==';
const validateURL = "http://api.odcloud.kr/api/nts-businessman/v1/validate";
const statusURL = "http://api.odcloud.kr/api/nts-businessman/v1/status";



// function: 사업자 등록증 진위 확인 api 요청 함수 validate //
export const checkBusinessRequest = async(requestBody: BusinessCheckRequestDto) => {
    const responseBody = await axios.post(`${validateURL}?serviceKey=${serviceKey}`, requestBody, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(responseDataHandler2<ApiResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 사업자 등록증 진위 확인 api 요청 함수 status //
export const checkBusinessNumRequest = async (requestBody: BusinessNumCheckRequestDto) => {
    const responseBody = await axios.post(`${statusURL}?serviceKey=${serviceKey}`, requestBody, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(responseDataHandler3<BusinessNumCheckResponseDto>)
      .catch(responseErrorHandler);
    return responseBody;
}

const FILE_UPLOAD_URL = `${MEMORIALDAY_API_DOMAIN}/file/upload`;
const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

// function: file upload 요청 함수 //
export const fileUploadRequest = async (requestBody: FormData) => {
    const url = await axios.post(FILE_UPLOAD_URL, requestBody, multipart)
        .then(responseDataHandler<string>)
        .catch(error => null);
    return url;
}

// function: get notice list 요청 함수 //
export const getNoticeListRequest = async () => {
    const responseBody = await axios.get(SUPPORT_NOTICE_API_URL)
        .then(responseDataHandler<GetNoticeListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get notice detail 요청 함수 //
export const getNoticeDetailRequest = async (noticeNumber: number | string) => {
    const responseBody = await axios.get(NOTICE_DETAIL_API_URL(noticeNumber))
        .then(responseDataHandler<GetNoticeDetailResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get qna list 요청 함수 //
export const getQnAListRequest = async () => {
    const responseBody = await axios.get(SUPPORT_QNA_API_URL)
        .then(responseDataHandler<GetQnAListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get qna detail 요청 함수 //
export const getQnADetailRequest = async (questionNumber: number | string) => {
    const responseBody = await axios.get(QNA_DETAIL_API_URL(questionNumber))
        .then(responseDataHandler<GetQnADetailResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: post QnA 요청 함수 //
export const PostQnARequest = async (requestBody: PostQnARequestDto, accessToken: string) => {
    const responseBody = await axios.post(QNA_WRITE_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: delete QnA 요청 함수 //
export const deleteQnARequest = async (questionNumber: number | string, accessToken: string) => {
    const responseBody = await axios.delete(QNA_DELETE_API_URL(questionNumber), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}
