import axios, { AxiosResponse } from "axios";
import PostStoreRequestDto from "./dto/request/store/post-store.request.dto";
import { ResponseDto } from "./dto/response";
import { IdCheckRequestDto, IdSearchAfterRequestDto, IdSearchBeforeRequestDto, PasswordSearchRequestDto, PasswordSearchTelAuthCheckRequestDto, PatchPasswordRequestDto, SignInRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request/auth";
import { IdSearchResponseDto } from "./dto/response/auth";


// variable: API URL 상수 //
const MEMORIALDAY_API_DOMAIN = process.env.REACT_APP_API_URL;

const MYPAGE_MODULE_URL = `${MEMORIALDAY_API_DOMAIN}/mypage`;

const MYPAGE_STORE_MODULE = `${MYPAGE_MODULE_URL}/store`;

const POST_STORE_API_MODULE = `${MYPAGE_STORE_MODULE}`;

//* Auth
const AUTH_MODULE_URL = `${MEMORIALDAY_API_DOMAIN}/api/v1/auth`;

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;
const ID_SEARCH_BEFORE_API_URL = `${AUTH_MODULE_URL}/id-search`;
const ID_SEARCH_AFTER_API_URL = `${AUTH_MODULE_URL}/id-search-result`;
const PASSWORD_SEARCH_API_URL = `${AUTH_MODULE_URL}/password-search`;
const PASSWORD_SEARCH_TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/password-search-tel-auth-check`;
const PATCH_PASSWORD_API_URL = `${AUTH_MODULE_URL}/password-resetting`;

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
export const postStoreRequest = async (requestBody: PostStoreRequestDto, accessToken: string) => {
  const responseBody = await axios.post(POST_STORE_API_MODULE, requestBody, bearerAuthorization(accessToken))
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: id search before 요청 함수 //
export const idSearchBeforeRequest = async (requestBody: IdSearchBeforeRequestDto) => {
  const responseBody = await axios.post(ID_SEARCH_BEFORE_API_URL, requestBody)
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: id search after 요청 함수 //
export const idSearchAfterRequest = async (requestBody: IdSearchAfterRequestDto) => {
  const responseBody = await axios.post(ID_SEARCH_AFTER_API_URL, requestBody)
    .then(responseDataHandler<IdSearchResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: password search (userId + telNumber) 요청 함수 //
export const passwordSearchRequest = async (requestBody: PasswordSearchRequestDto) => {
  const responseBody = await axios.post(PASSWORD_SEARCH_API_URL, requestBody)
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: password search tel-auth check (telNumber + telAuthNumber) 요청 함수 //
export const passwordSearchTelAuthCheckRequest = async (requestBody: PasswordSearchTelAuthCheckRequestDto) => {
  const responseBody = await axios.post(PASSWORD_SEARCH_TEL_AUTH_CHECK_API_URL, requestBody)
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};

// function: patch password 요청 함수 //
export const patchPasswordRequest = async (requestBody: PatchPasswordRequestDto) => {
  const responseBody = await axios.patch(PATCH_PASSWORD_API_URL, requestBody)
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};