import axios, { AxiosResponse } from "axios";
import { ResponseDto } from "./dto/response";
import { IdCheckRequestDto, SignInRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request";

// variable: API URL 상수 //
const THEMEMORIALDAY_API_DOMAIN = process.env.REACT_APP_API_URL;

const AUTH_MODULE_URL = `${THEMEMORIALDAY_API_DOMAIN}/api/v1/auth`;

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;
const ID_SEARCH_API_URL = `${AUTH_MODULE_URL}/id-search`;

// function: Authorization Bearer 헤더 //
const bearerAuthorization = (accessToken: string) => ({headers: {'Authorization': `Bearer ${accessToken}`}});

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
};

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

// function: id search 요청 함수 //