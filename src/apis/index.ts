import axios, { AxiosResponse } from "axios";
import PostStoreRequestDto from "./dto/request/store/post-store.request.dto";
import { ResponseDto } from "./dto/response";
import { IdCheckRequestDto, IdSearchAfterRequestDto, IdSearchBeforeRequestDto, PasswordSearchRequestDto, PasswordSearchTelAuthCheckRequestDto, PatchPasswordRequestDto, SignInRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request/auth";
import { GetOnlyPasswordResponseDto, IdSearchResponseDto } from "./dto/response/auth";
import { BusinessNumCheckRequestDto, PatchJoinRequestDto } from "./dto/request/join";
import { BusinessNumCheckResponseDto } from "./dto/response/join";
import GetSignInResponseDto from "./dto/response/auth/get-sign-in-response.dto";
import { PasswordCheckOfUserUpdateRequestDto, PatchUserInfoRequestDto } from "./dto/request/mypage_user_info";
import { GetUserInfosResponseDto } from "./dto/response/mypage_user_info";



// variable: API URL 상수 //
const MEMORIALDAY_API_DOMAIN = process.env.REACT_APP_API_URL;

const MYPAGE_MODULE_URL = `${MEMORIALDAY_API_DOMAIN}/mypage`;
const MYPAGE_USER_UPDATE_PASSWORD_CHECK_API_URL = `${MYPAGE_MODULE_URL}/password-check`;
const MYPAGE_PATCH_USER_INFO_API_URL = (userId: string) => `${MYPAGE_MODULE_URL}/${userId}`;

const MYPAGE_STORE_MODULE = `${MYPAGE_MODULE_URL}/store`;

const PATCH_JOIN_URL = (userId: string | null) => `${MEMORIALDAY_API_DOMAIN}/join/${userId}`;

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
const PASSWORD_SEARCH_AND_GET_PASSWORD_API_URL = (userId: string) => `${AUTH_MODULE_URL}/password-search/${userId}`;
const PASSWORD_SEARCH_TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/password-search-tel-auth-check`;
const PATCH_PASSWORD_API_URL = `${AUTH_MODULE_URL}/password-resetting`;
const GET_SIGN_IN_API_URL = `${AUTH_MODULE_URL}/get-sign-in`;

// function: Authorizarion Bearer 헤더 //
const bearerAuthorization = (accessToken: string) => ({ headers: { 'Authorization': `Bearer ${accessToken}` } })

// function: response data 처리 함수 //
const responseDataHandler = <T>(response: AxiosResponse<T, any>) => {
  const { data } = response;
  return data;
}

// function: response data 처리 함수 //
const responseDataHandler3 = <T extends BusinessNumCheckResponseDto>(response: AxiosResponse<T, any>) => {
  const { data } = response;
  if(data.status_code === 'OK') {
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
    .then(responseDataHandler<GetOnlyPasswordResponseDto>)
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

// function: 비밀번호 재설정 patch password 요청 함수 //
export const patchPasswordRequest = async (requestBody: PatchPasswordRequestDto) => {
  const responseBody = await axios.patch(PATCH_PASSWORD_API_URL, requestBody)
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
}

// function: get sign in 요청 함수 //
export const GetSignInRequest = async(accessToken: string) => {
  const responseBody = await axios.get(GET_SIGN_IN_API_URL, bearerAuthorization(accessToken))
    .then(responseDataHandler<GetSignInResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
}

// function: patch join 요청 함수 //
export const patchJoinRequest = async(requestBody: PatchJoinRequestDto, userId: string, accessToken: string) => {
  const responseBody = await axios.patch(PATCH_JOIN_URL(userId), requestBody, bearerAuthorization(accessToken))
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
}

// function: 회원 정보 수정 patch user info 요청 함수 //
export const patchUserInfoRequest = async (requestBody: PatchUserInfoRequestDto, userId: string, accessToken: string) => {
  const responseBody = await axios.patch(MYPAGE_PATCH_USER_INFO_API_URL(userId), requestBody, bearerAuthorization(accessToken))
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
}

// API 요청 URL 및 serviceKey 설정
const apiUrl = "http://api.odcloud.kr/api/nts-businessman/v1/status";
const serviceKey = "9tvM0W192uuqj1Wn7OdBwQLLdPvkYJNS450lJnvILRCNGbQoDXcihyDyQ/d/tx4Q78ii38jdMbWMeKB8ikiSVw==";

// function: 사업자 등록증 진위 확인 api 요청 함수2 //
export const checkBusinessNumRequest = async(requestBody: BusinessNumCheckRequestDto) => {
  const responseBody = await axios.post(`${apiUrl}?serviceKey=${serviceKey}`, requestBody, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(responseDataHandler3<BusinessNumCheckResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
}


const FILE_UPLOAD_URL = `${MEMORIALDAY_API_DOMAIN}/file/upload`;
const multipart = {headers: {'Content-Type': 'multipart/form-data'}};

// function: file upload 요청 함수 //
export const fileUploadRequest = async(requestBody: FormData) => {
    const url = await axios.post(FILE_UPLOAD_URL, requestBody, multipart)
        .then(responseDataHandler<string>)
        .catch(error => null);
    return url;
};