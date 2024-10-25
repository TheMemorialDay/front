import { ResponseDto } from "./response";
import axios, { AxiosResponse } from "axios"
import GetNoticeListResponseDto from "./response/support/get-notice-list-response.dto";
import { GetNoticeDetailResponseDto, GetQnADetailResponseDto, GetQnAListResponseDto } from "./response/support";
import { PostQnARequestDto } from "./request/support";

// variable: api url 상수//
const THE_MEMORIAL_DAY_MAIN_DOMAIN = process.env.REACT_APP_API_URL;

const SUPPORT_API_URL = `${THE_MEMORIAL_DAY_MAIN_DOMAIN}/support`;
const SUPPORT_NOTICE_API_URL = `${SUPPORT_API_URL}/notice`;
const NOTICE_DETAIL_API_URL = (noticeNumber: string | number) =>  `${SUPPORT_NOTICE_API_URL}/${noticeNumber}`;

const SUPPORT_QNA_API_URL = `${SUPPORT_NOTICE_API_URL}/question`;
const QNA_DETAIL_API_URL = (questionNumber: number | string) => `${SUPPORT_QNA_API_URL}/${questionNumber}`;
const QNA_WRITE_API_URL = `${SUPPORT_QNA_API_URL}/write`;
const QNA_DELETE_API_URL = (questionNumber: number | string) => `${SUPPORT_QNA_API_URL}/${questionNumber}`;

// function: Authorization Bearer 헤더 값//
const bearerAuthorization = (accessToken: String) => ({headers: {'Authorization': `Bearer ${accessToken}`}});

// function: response data 처리 함수 //
const responseDataHandler = <T>(response: AxiosResponse<T, any>) => {
    const {data} = response;
    return data;
};

// function: response error 처리 함수 //
const responseErrorHandler = (error: any) => {
    if(!error.response) return null;
    const {data} = error.response;
    return data as ResponseDto;
};

// function: get notice list 요청 함수 //
export const getNoticeListRequest = async() => {
    const responseBody = await axios.get(SUPPORT_NOTICE_API_URL)
        .then(responseDataHandler<GetNoticeListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get notice detail 요청 함수 //
export const getNoticeDetailRequest = async(noticeNumber: number | string) => {
    const responseBody = await axios.get(NOTICE_DETAIL_API_URL(noticeNumber))
        .then(responseDataHandler<GetNoticeDetailResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get qna list 요청 함수 //
export const getQnAListRequest = async() => {
    const responseBody = await axios.get(SUPPORT_QNA_API_URL)
        .then(responseDataHandler<GetQnAListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get qna detail 요청 함수 //
export const getQnADetailRequest = async(questionNumber: number | string) => {
    const responseBody = await axios.get(QNA_DETAIL_API_URL(questionNumber))
        .then(responseDataHandler<GetQnADetailResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: post QnA 요청 함수 //
export const PostQnARequest = async(requestBody: PostQnARequestDto) => {
    const responseBody = await axios.post(QNA_WRITE_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: delete QnA 요청 함수 //
export const deleteQnARequest = async(questionNumber: number | string) => {
    const responseBody = await axios.delete(QNA_DELETE_API_URL(questionNumber))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}