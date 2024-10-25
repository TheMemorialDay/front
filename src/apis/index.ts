import axios, { AxiosResponse } from "axios";
import PostStoreRequestDto from "./dto/request/store/post-store.request.dto";
import { ResponseDto } from "./dto/response";

// variable: API URL 상수 //
const MEMORIALDAY_API_DOMAIN = process.env.REACT_APP_API_URL;

const MYPAGE_MODULE_URL = `${MEMORIALDAY_API_DOMAIN}/mypage`;

const MYPAGE_STORE_MODULE = `${MYPAGE_MODULE_URL}/store`;

const POST_STORE_API_MODULE = `${MYPAGE_STORE_MODULE}`;

// function: Authorizarion Bearer 헤더 //
const bearerAuthorization = (accessToken: string) => ({ headers: { 'Authorization': `Bearer ${accessToken}` } })

// function: response data 처리 함수 //
const responseDataHandler = <T>(response: AxiosResponse<T, any>) => {
  const { data } = response;
  return data;
};

// function: response error 처리 함수 //
const responseErrorHandler = (error: any) => {
  if (!error.response) return null;
  const { data } = error.response;
  return data as ResponseDto;
}

// function: post Store 요청 함수 //
export const postStoreRequest = async (requestBody: PostStoreRequestDto, accessToken: string) => {
  const responseBody = await axios.post(POST_STORE_API_MODULE, requestBody, bearerAuthorization(accessToken))
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler);
  return responseBody;
};