import axios, { AxiosResponse } from "axios";
import PostStoreRequestDto from "./dto/request/store/post-store.request.dto";
import { ResponseDto } from "./dto/response";
import { IdCheckRequestDto, PasswordResettingFinalRequestDto, PasswordResettinIdTelRequestDto, PasswordSearchTelAuthCheckRequestDto, PatchPasswordRequestDto, SignInRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request/auth";
import { IdSearchResponseDto } from "./dto/response/auth";
import { GetProductDetailResponseDto, GetProductPreviewListResponseDto, GetReviewListResponseDto } from "./dto/response/stores";
import { PatchJoinRequestDto } from "./dto/request/join";
import GetSignInResponseDto from "./dto/response/auth/get-sign-in-response.dto";
import { PasswordCheckOfUserUpdateRequestDto, PatchUserInfoRequestDto } from "./dto/request/mypage_user_info";
import { GetNewInfo, GetUserInfosResponseDto } from "./dto/response/mypage_user_info";
import { PostProductRequestDto } from './dto/request/product/post-product-request.dto';
import { GetProductListResponseDto, GetProductResponseDto } from './dto/response/product';
import { GetStoreListResponseDto, GetStoreResponseDto } from "./dto/response/stores";
import { PatchStoreRequestDto } from "./dto/request/store";
import BusinessCheckRequestDto from "./dto/request/join/business-check.request.dto";
import ApiResponseDto from "./dto/response/join/api-response.dto";
import GetStoreNumber from './dto/response/product/get-store-number-response.dto';
import IdSearchNameTelNumberRequestDto from "./dto/request/auth/Id-search-name-tel-number.request.dto";
import IdSearchTelAndAuthRequestDto from "./dto/request/auth/Id-search-tel-and-auth.request.dto";
import { PostOrderRequestDto, PostSendPaymentMsgRequestDto } from './dto/request/order';
import GetMyPageLikeStoreListResponseDto from './dto/response/like/get-mypage-likestore-list.response.dto';
import GetOrderDetailListResponseDto from './dto/response/get-order-detail-list.response.dto';
import { GetNoticeDetailResponseDto, GetNoticeListResponseDto, GetQnADetailResponseDto, GetQnAListResponseDto } from './dto/response/support';
import { PostQnARequestDto } from './dto/request/support';
import { PostLikeStoreRequestDto, PostPayMentRequestDto } from "./dto/request";
import PatchOrderStatusReqeustDto from "./dto/request/order/patch-order-status-request.dto";
import { GetMyReviewListResponseDto } from "./dto/response/mypage-review";
import { PostReviewRequestDto } from "./dto/request/review";
import { getMypageLikeStoreReviewNRating } from "./dto/response/like";
import { GetHotThemeResponseDto, GetKeywordResponseDto } from "./dto/response/home";
import NewGetOrderManageList from "./dto/response/new-get-order-manage.response.dto";
import { SalesListResponseDto } from "./dto/response/sales/get-sales-list.response.dto";


// variable: API URL 상수 //

const MEMORIALDAY_API_DOMAIN = process.env.REACT_APP_API_URL;

//* 홈 - 키워드 & 테마
const GET_KEYWORD_API_URL = `${MEMORIALDAY_API_DOMAIN}/hot-keyword`;
const GET_THEME_API_URL = `${MEMORIALDAY_API_DOMAIN}/hot-theme`;

const PRODUCT_MODULE_URL = `${MEMORIALDAY_API_DOMAIN}/mypage/product`;
const DELETE_PRODUCT_API_URL = (productNumber: number | string) => `${PRODUCT_MODULE_URL}/${productNumber}`;

//* ========================= stores
const GET_STORE_LIST_API_URL = `${MEMORIALDAY_API_DOMAIN}/stores`;
const GET_STORE_LIST_TOTAL_SEARCH_API_URL = `${GET_STORE_LIST_API_URL}/search-main`;
const POST_KEYWORD_API_URL = `${GET_STORE_LIST_API_URL}/keyword`;
//* ========================= stores
const POST_LIKE_API_URL = `${MEMORIALDAY_API_DOMAIN}/stores`;
const DELETE_LIKE_API_URL = (userId: string, storeNumber: number | string) => `${POST_LIKE_API_URL}?userId=${userId}&storeNumber=${storeNumber}`;
const GET_PRODUCT_PREVIEW_LIST_API_URL = (storeNumber: number | string) => `${GET_STORE_LIST_API_URL}/${storeNumber}/order/list`
const GET_PRODUCT_DETAIL_API_URL = (storeNumber: number | string, productNumber: number | string) => `${GET_STORE_LIST_API_URL}/${storeNumber}/order/${productNumber}`;
const POST_ORDER_DETAIL_API_URL = (storeNumber: number | string, productNumber: number | string, userId: string) => `${GET_STORE_LIST_API_URL}/${storeNumber}/order/${productNumber}/${userId}`;
const GET_REVIEW_LIST_API_URL = (storeNumber: number | string) => `${POST_LIKE_API_URL}/${storeNumber}/review/list`;

const MYPAGE_MODULE_URL = `${MEMORIALDAY_API_DOMAIN}/mypage`;
// MyPage UserInfo
const MYPAGE_USER_INFO_API_URL = `${MYPAGE_MODULE_URL}/user-info`;
// 마이페이지 정보 수정 들어갈 때 비밀번호 확인 URL
const MYPAGE_USER_UPDATE_PASSWORD_CHECK_API_URL = `${MYPAGE_USER_INFO_API_URL}/password-check`;
// 마이페이지 정보 수정 중 전화번호 인증 URL
const MYPAGE_PATCH_USER_INFO_TEL_AUTH_API_URL = `${MYPAGE_USER_INFO_API_URL}/tel-auth`;
// 마이페이지 정보 수정 중 전화번호 + 인증번호 인증 URL
const MYPAGE_PATCH_USER_INFO_TEL_AUTH_CHECK_API_URL = `${MYPAGE_USER_INFO_API_URL}/tel-auth-check`;
// 마이페이지 최종 수정 URL
const MYPAGE_PATCH_USER_COMPLETED_API_URL = `${MYPAGE_USER_INFO_API_URL}/patch-info`;
const GET_NEW_USER_INFO_API_URL =  (userId: string) => `${MYPAGE_USER_INFO_API_URL}/${userId}`;

const GET_STORE_NUMBER_API_URL = (userId: string) => `${MEMORIALDAY_API_DOMAIN}/mypage/product/add/${userId}`;

const GET_MY_REVIEW_LIST_API_URL = (userId: string) => `${MYPAGE_MODULE_URL}/review?userId=${userId}`;

const MYPAGE_STORE_MODULE = `${MYPAGE_MODULE_URL}/store`;

const PATCH_JOIN_URL = (userId: string | null) => `${MEMORIALDAY_API_DOMAIN}/join/${userId}`;

const POST_STORE_API_MODULE = `${MYPAGE_STORE_MODULE}`;
const GET_MYPAGE_STORE_API_URL = (storeNumber: number | string) => `${MYPAGE_STORE_MODULE}/${storeNumber}`;
const GET_MYPAGE_LIKE_STORE_API_URL = (userId: string) => `${MYPAGE_MODULE_URL}/like/${userId}`;
const PATCH_STORE_API_URL = (storeNumber: number | string) => `${MYPAGE_STORE_MODULE}/${storeNumber}`;
const GET_MYPAGE_LIKE_STORE_INFO_API_URL = (userId: string) => `${MYPAGE_MODULE_URL}/like/${userId}/info`;

const GET_STORE_API_URL = (storeNumber: number | string) => `${GET_STORE_LIST_API_URL}/${storeNumber}`

//* Auth
const GET_ORDER_DETAIL_API_URL = (userId: string) => `${MYPAGE_MODULE_URL}/order-detail/${userId}`;
const PATCH_ORDER_STATUS_API_URL = (orderCode: string) => `${MYPAGE_MODULE_URL}/order-detail/${orderCode}`;
const POST_REVIEW_API_URL = `${MYPAGE_MODULE_URL}/order-detail/write-review`;

const GET_ORDER_MANAGE_API_URL = (storeNumber: number | string) => `${MYPAGE_MODULE_URL}/order-manage/${storeNumber}`;
const POST_SEND_PAYMENT_MSG_API_URL = `${MYPAGE_MODULE_URL}/order-manage/send-pay-msg`;
const GET_SALES_API_URL = (userId: string) => `${MYPAGE_MODULE_URL}/sales?userId=${userId}`;

const AUTH_MODULE_URL = `${MEMORIALDAY_API_DOMAIN}/api/v1/auth`;

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;
const DELETE_USER_API_URL = `${AUTH_MODULE_URL}/delete-user/me`;

//* ====================== 아이디 찾기
const ID_SEARCH_NAME_TEL_API_URL = `${AUTH_MODULE_URL}/id-search-first`;
const ID_SEARCH_TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/id-search-middle`;
const ID_SEARCH_RESULT_API_URL = `${AUTH_MODULE_URL}/id-search-result`;
//* ====================== 아이디 찾기

//* ================== 비밀번호 재설정
const PASSWORD_RESETTING_ID_TEL_API_URL = `${AUTH_MODULE_URL}/password-search`;
const PASSWORD_RESETTING_TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/password-search-tel-auth-check`;
const PASSWORD_RESETTING_FINAL_CHECK_API_URL = `${AUTH_MODULE_URL}/password-search-final`;
const PATCH_PASSWORD_API_URL = `${AUTH_MODULE_URL}/password-resetting`;
//* ================== 비밀번호 재설정

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

// function: get hot keyword 요청 함수 //
export const getKeywordRequest = async () => {
    const responseBody = await axios.get(GET_KEYWORD_API_URL)
        .then(responseDataHandler<GetKeywordResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get hot theme 요청 함수 //
export const getThemeRequest = async () => {
    const responseBody = await axios.get(GET_THEME_API_URL)
        .then(responseDataHandler<GetHotThemeResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

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
        const response = await axios.post(`${MEMORIALDAY_API_DOMAIN}/mypage/product/${storeNumber}`, requestBody, bearerAuthorization(accessToken));
        return responseDataHandler<ResponseDto>(response);
    } catch (error) {
        const errorData = responseErrorHandler(error);
        throw errorData;
    }
};

// function: get product list 요청 함수 //                               토큰 인증 관련 지우고 임의로 진행(원래는 위와 같이(63~68) 작성)
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
    for (const item of data.data) {
        return item.valid;
    }
    return null; 
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

// function: 회원 정보 수정 patch user info 요청 함수 //
export const patchUserInfoRequest = async (requestBody: PatchUserInfoRequestDto, accessToken: string) => {
    const responseBody = await axios.patch(MYPAGE_PATCH_USER_COMPLETED_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: tel auth api 요청 함수 //
export const telAuthRequest = async (requestBody: TelAuthRequestDto) => {
    const responseBody = await axios.post(TEL_AUTH_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: MYPAGE USER INFO tel auth api 요청 함수 //
export const userInfoTelAuthReqeust = async (requestBody: TelAuthRequestDto, accessToken: string) => {
    const responseBody = await axios.post(MYPAGE_PATCH_USER_INFO_TEL_AUTH_API_URL, requestBody, bearerAuthorization(accessToken))
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

// function: MYPAGE USER INFO tel auth check api 요청 함수 //
export const userInfoTelAuthCheckRequest = async (requestBody: TelAuthCheckRequestDto, accessToken: string) => {
    const responseBody = await axios.post(MYPAGE_PATCH_USER_INFO_TEL_AUTH_CHECK_API_URL, requestBody, bearerAuthorization(accessToken))
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

// function: 개인 정보 수정 비밀번호 확인 user update password check 요청 함수 //
export const passwordCheckOfUserUpdateRequest = async (requestBody: PasswordCheckOfUserUpdateRequestDto, accessToken: string) => {
    const responseBody = await axios.post(MYPAGE_USER_UPDATE_PASSWORD_CHECK_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetUserInfosResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: id search first 요청 함수 (name + telNumber) //
export const idSearchNameTelNumberRequest = async (requestBody: IdSearchNameTelNumberRequestDto) => {
    const responseBody = await axios.post(ID_SEARCH_NAME_TEL_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: id search middle (전화번호 + 인증번호) 요청 함수 //
export const idSearchTelAuthRequest = async (requestBody: IdSearchTelAndAuthRequestDto) => {
    const responseBody = await axios.post(ID_SEARCH_TEL_AUTH_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get id search result 요청 함수 //
export const getIdSearchRequest = async (requestBody: IdSearchNameTelNumberRequestDto) => {
    const responseBody = await axios.post(ID_SEARCH_RESULT_API_URL, requestBody)
        .then(responseDataHandler<IdSearchResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: password resetting (userId + telNumber) 요청 함수 //
export const passwordResettingIdTelRequest = async (requestBody: PasswordResettinIdTelRequestDto) => {
    const responseBody = await axios.post(PASSWORD_RESETTING_ID_TEL_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: password RESETTING tel-auth check (telNumber + telAuthNumber) 요청 함수 //
export const passwordResettingTelAuthCheckRequest = async (requestBody: PasswordSearchTelAuthCheckRequestDto) => {
    const responseBody = await axios.post(PASSWORD_RESETTING_TEL_AUTH_CHECK_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: password resetting final check 요청 함수 //
export const passwordResettingFinalCheckRequest = async (requestBody: PasswordResettingFinalRequestDto) => {
    const responseBody = await axios.post(PASSWORD_RESETTING_FINAL_CHECK_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 비밀번호 재설정 patch password 요청 함수 //
export const patchPasswordRequest = async (requestBody: PatchPasswordRequestDto) => {
    const responseBody = await axios.patch(PATCH_PASSWORD_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

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

// function: get mypage like store review and rating 요청 함수 //
export const getMypageLikeStoreReviewNRatingRequest = async(userId: string, accessToken: string) => {
    const responseBody = await axios.get(GET_MYPAGE_LIKE_STORE_INFO_API_URL(userId), bearerAuthorization(accessToken))
        .then(responseDataHandler<getMypageLikeStoreReviewNRating>)
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

// function: get Order Manage 요청 함수 //
export const getOrderManageRequest = async (storeNumber: number | string, accessToken: string) => {
    const responseBody = await axios.get(GET_ORDER_MANAGE_API_URL(storeNumber), bearerAuthorization(accessToken))
        .then(responseDataHandler<NewGetOrderManageList>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: post send payment message 요청 함수 //
export const postSendPaymentMsgRequest = async(requestBody: PostSendPaymentMsgRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_SEND_PAYMENT_MSG_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: patch OrderStatus 요청 함수 //
export const patchOrderStatusRequest = async (requestBody: PatchOrderStatusReqeustDto, orderCode: string, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_ORDER_STATUS_API_URL(orderCode), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
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

// function: get Sales 요청 함수 //
export const getSalesRequest = async (userId: string, accessToken: string) => {
    const responseBody = await axios.get(GET_SALES_API_URL(userId), bearerAuthorization(accessToken))
        .then(responseDataHandler<SalesListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};


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

// function: post review 요청 함수 //
export const postReviewRequest = async (requestBody: PostReviewRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_REVIEW_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get review list 요청 함수 //
export const getReviewListRequest = async (storeNumber: string | number) => {
    const responseBody = await axios.get(GET_REVIEW_LIST_API_URL(storeNumber))
        .then(responseDataHandler<GetReviewListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get my review list 요청 함수 //
export const getMyReviewListRequest = async (userId: string, accessToken: string) => {
    const responseBody = await axios.get(GET_MY_REVIEW_LIST_API_URL(userId), bearerAuthorization(accessToken))
        .then(responseDataHandler<GetMyReviewListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// API 요청 URL 및 serviceKey 설정
//const serviceKey = '9tvM0W192uuqj1Wn7OdBwQLLdPvkYJNS450lJnvILRCNGbQoDXcihyDyQ/d/tx4Q78ii38jdMbWMeKB8ikiSVw==';
const serviceKey = process.env.REACT_APP_BUSINESS_API_SERVICE_KEY as string;
const validateURL = "http://api.odcloud.kr/api/nts-businessman/v1/validate";


// function: 사업자 등록증 진위 확인 api 요청 함수 validate //
export const checkBusinessRequest = async (requestBody: BusinessCheckRequestDto) => {
    const responseBody = await axios.post(`${validateURL}?serviceKey=${serviceKey}`, requestBody, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(responseDataHandler2<ApiResponseDto>)
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

// function: store main search 병합 버전 요청 함수 //
export const getStoreMainSearchRequest = async (searchKeyword: string) => {
    const responseBody = await axios.get(GET_STORE_LIST_TOTAL_SEARCH_API_URL, { params: { searchKeyword } })
        .then(responseDataHandler<GetStoreListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};
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

// function: 회원 정보 받기 //
export const getNewInfo = async(accessToken: string, userId: string) => {
    const responseBody = await axios.get(GET_NEW_USER_INFO_API_URL(userId), bearerAuthorization(accessToken))
        .then(responseDataHandler<GetNewInfo>)
        .catch(responseErrorHandler);
    return responseBody;
}

//* 회원 탈퇴
// function: delete user 요청 함수 //
export const deleteUserRequest = async (accessToken: string) => {
    const responseBody = await axios.delete(DELETE_USER_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

//* 키워드 저장
// function: post keyword 요청 함수 //
export const postKeywordRequest = async (keyword: string) => {
    const responseBody = await axios.post(POST_KEYWORD_API_URL, {}, { params: { keyword } })
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};