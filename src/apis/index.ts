import axios, { AxiosResponse } from "axios";
import { IdCheckRequestDto, SignInRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request";
import PostStoreRequestDto from "./dto/request/store/post-store.request.dto";
import { ResponseDto } from "./dto/response";
import { GetStoreListResponseDto, GetStoreResponseDto } from "./dto/response/stores";


// variable: API URL 상수 //
const MEMORIALDAY_API_DOMAIN = process.env.REACT_APP_API_URL;

const GET_STORE_LIST_API_URL = `${MEMORIALDAY_API_DOMAIN}/stores`;

const MYPAGE_MODULE_URL = `${MEMORIALDAY_API_DOMAIN}/mypage`;

const MYPAGE_STORE_MODULE = `${MYPAGE_MODULE_URL}/store`;

const POST_STORE_API_MODULE = `${MYPAGE_STORE_MODULE}`;
const GET_STORE_API_URL = (storeNumber: number | string) => `${MYPAGE_STORE_MODULE}/${storeNumber}`;

const AUTH_MODULE_URL = `${MEMORIALDAY_API_DOMAIN}/api/v1/auth`;

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;
const ID_SEARCH_API_URL = `${AUTH_MODULE_URL}/id-search`;

// function: Authorizarion Bearer 헤더 //
const bearerAuthorization = (accessToken: string) => ({ headers: { 'Authorization': `Bearer ${accessToken}` } })

// function: response data 처리 함수 //
const responseDataHandler = <T>(response: AxiosResponse<T, any>) => {
  const { data } = response;
  return data;
}

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

// function: get Store List 요청 함수 //
export const getStoreListRequest = async () => {
  const responseBody = await axios.get(GET_STORE_LIST_API_URL)
    .then(responseDataHandler<GetStoreListResponseDto>)
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