import axios, { AxiosResponse } from 'axios';
import { PostProductRequestDto, PostProductOptionDetailRequestDto, PostProductOptionRequestDto } from './dto/request/product/post-product-request.dto'; // DTO import
import ResponseDto from './dto/response/response.dto';
import { GetProductListResponseDto, GetProductResponseDto } from './dto/response/product';
import { IdCheckRequestDto, SignInRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request";
import PostStoreRequestDto from "./dto/request/store/post-store.request.dto";
import { GetStoreListResponseDto, GetStoreResponseDto } from "./dto/response/stores";
import { GetSignInResponseDto } from "./dto/response/auth";
import { BusinessNumCheckRequestDto, PatchJoinRequestDto } from "./dto/request/join";
import { BusinessNumCheckResponseDto } from "./dto/response/join";
import BusinessCheckRequestDto from "./dto/request/join/business-check.request.dto";
import ApiResponseDto from "./dto/response/join/api-response.dto";

// variable: API URL 상수 //

const MEMORIALDAY_API_DOMAIN = process.env.REACT_APP_API_URL;

const PRODUCT_MODULE_URL = `${MEMORIALDAY_API_DOMAIN}/mypage/product`;

const POST_PRODUCT_API_URL = `${PRODUCT_MODULE_URL}`;
const GET_PRODUCT_LIST_API_URL = `${PRODUCT_MODULE_URL}`;
const GET_PRODUCT_API_URL = (productNumber: number | string) => `${PRODUCT_MODULE_URL}/${productNumber}`;
// const PATCH_PRODUCT_API_URL = (productNumber: number | string) => `${PRODUCT_MODULE_URL}/${productNumber}`;
// const DELETE_PRODUCT_API_URL = (productNumber: number | string) => `${PRODUCT_MODULE_URL}/${productNumber}`;

const GET_STORE_LIST_API_URL = `${MEMORIALDAY_API_DOMAIN}/stores`;

const MYPAGE_MODULE_URL = `${MEMORIALDAY_API_DOMAIN}/mypage`;

const MYPAGE_STORE_MODULE = `${MYPAGE_MODULE_URL}/store`;

const PATCH_JOIN_URL = (userId: string | null) => `${MEMORIALDAY_API_DOMAIN}/join/${userId}`;

const POST_STORE_API_MODULE = `${MYPAGE_STORE_MODULE}`;
const GET_STORE_API_URL = (storeNumber: number | string) => `${MYPAGE_STORE_MODULE}/${storeNumber}`;

const AUTH_MODULE_URL = `${MEMORIALDAY_API_DOMAIN}/api/v1/auth`;

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;
const ID_SEARCH_API_URL = `${AUTH_MODULE_URL}/id-search`;
const GET_SIGN_IN_API_URL = `${AUTH_MODULE_URL}/get-sign-in`;

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

// function: post product 요청 함수 //                              토큰 인증 관련 지우고 임의로 진행(원래는 위와 같이 작성)
export const postProductRequest = async (requestBody: PostProductRequestDto, storeNumber: number | string) => {
    try {
        // const response = await axios.post(POST_PRODUCT_API_URL, requestBody);
        const response = await axios.post(`${MEMORIALDAY_API_DOMAIN}/mypage/product/${storeNumber}`, requestBody);

        return responseDataHandler<ResponseDto>(response);
    } catch (error) {
        const errorData = responseErrorHandler(error);
        throw errorData;
    }
};

// function: get product list 요청 함수 //                               토큰 인증 관련 지우고 임의로 진행(원래는 위와 같이(63~68) 작성)

// getProductListRequest.ts
export const getProductListRequest = async (userId: string): Promise<GetProductListResponseDto | null> => {
    try {
        const response = await axios.get(`${MEMORIALDAY_API_DOMAIN}/mypage/product/${userId}`);
        return responseDataHandler<GetProductListResponseDto>(response); // 일단 에러 해결때문에 이렇게 작성
    } catch (error) {
        responseErrorHandler(error);
        return null;
    }
};

// function: get product 요청 함수 //                                       로그인 끝나면 위와 같이 수정(토큰 포함)
export const getProductRequest = async (productNumber: number | string): Promise<GetProductResponseDto | null> => {
    try {
        const response = await axios.get(`${MEMORIALDAY_API_DOMAIN}/mypage/product/update/${productNumber}`);
        return responseDataHandler<GetProductResponseDto>(response);
    } catch (error) {
        responseErrorHandler(error);
        return null;
    }
};

// function: patch product 요청 함수 //

export const patchProductRequest = async (productNumber: number | string, data: PostProductRequestDto): Promise<any> => {
    try {
        const response = await axios.patch(`${MEMORIALDAY_API_DOMAIN}/mypage/product/${productNumber}`, data);
        return responseDataHandler(response);
    } catch (error) {
        responseErrorHandler(error);
        return null;
    }
};

const FILE_UPLOAD_URL = `${MEMORIALDAY_API_DOMAIN}/file/upload`;

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

// function: response data 처리 함수 //
const responseDataHandler2 = <T extends ApiResponseDto>(response: AxiosResponse<T, any>) => {
  const {data} = response;
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

// function: response data 처리 함수 //
const responseDataHandler3 = <T extends BusinessNumCheckResponseDto>(response: AxiosResponse<T, any>) => {
    const { data } = response;
    if (data.status_code === 'OK') {
        const b_stt_cd = data.data[0].b_stt_cd;
        return b_stt_cd;
    }
    return data.status_code;
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
export const postStoreRequest = async (requestBody: PostStoreRequestDto) => {
    const responseBody = await axios.post(POST_STORE_API_MODULE, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

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

// function: patch join 요청 함수 //
export const patchJoinRequest = async (requestBody: PatchJoinRequestDto, userId: string, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_JOIN_URL(userId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// API 요청 URL 및 serviceKey 설정
const apiUrl2 = "http://api.odcloud.kr/api/nts-businessman/v1/validate";
const apiUrl = "http://api.odcloud.kr/api/nts-businessman/v1/status";
const serviceKey = process.env.BUSINESS_API_SERVICE_KEY;

// function: 사업자 등록증 진위 확인 api 요청 함수1 //
export const checkBusinessRequest = async(accessToken: string, requestBody: BusinessCheckRequestDto) => {
  const responseBody = await axios.post(`${apiUrl2}?serviceKey=${serviceKey}`, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(responseDataHandler2<ApiResponseDto>)
      .catch(responseErrorHandler);
  return responseBody;
}

// function: 사업자 등록증 진위 확인 api 요청 함수2 //
export const checkBusinessNumRequest = async (requestBody: BusinessNumCheckRequestDto) => {
    const responseBody = await axios.post(`${apiUrl}?serviceKey=${serviceKey}`, requestBody, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(responseDataHandler3<BusinessNumCheckResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}


// function: file upload 요청 함수 //
export const fileUploadRequest = async (requestBody: FormData) => {
    const url = await axios.post(FILE_UPLOAD_URL, requestBody, multipart)
        .then(responseDataHandler<string>)
        .catch(error => null);
    return url;
}
