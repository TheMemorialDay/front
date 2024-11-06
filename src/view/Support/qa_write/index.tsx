import React, { ChangeEvent, useState } from 'react'
import SupportNavi from '../../../components/support_navi'
import './style.css';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, SU_ABSOLUTE_QA_PATH } from '../../../constants';
import { ResponseDto } from '../../../apis/dto/response';
import { PostQnARequestDto } from '../../../apis/dto/request/support';
import { useCookies } from 'react-cookie';
import { useSignInUserStore } from '../../../stores';
import { PostQnARequest } from '../../../apis';

export default function QaWrite() {

    // state: 쿠키 상태 //
    const [cookies] = useCookies();

    // state: 로그인 유저 상태 //
    const { signInUser } = useSignInUserStore();

    // state: 제목 상태 //
    const [questionTitle, setSubjact] = useState<string>('');
    // state: 내용 상태 //
    const [questionContents, setquestionContents] = useState<string>('');

    // function: 네비게이터 //
    const navigator = useNavigate();

    // function: post QnA response 처리 함수 //
    const postQnAResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '모두 입력해주세요.' :
                    responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
                        responseBody?.code === 'AF' ? '잘못된 접근입니다.' : 'SU';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        alert('등록이 완료되었습니다.');
        navigator(SU_ABSOLUTE_QA_PATH);
    };

    // event handler: 제목 입력 상태 //
    const onquestionTitleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSubjact(value);
    };

    // event handler: 내용 입력 상태 //
    const onquestionContentsChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setquestionContents(value);
    };

    // event handler: 큐엔에이 작성 취소 버튼 //
    const onWriteCancleButtonHandler = () => {
        navigator(SU_ABSOLUTE_QA_PATH);
    };

    // event handler: 큐엔에이 등록 버튼 //
    const onWriteRegisterButtonHandler = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        if (!questionTitle || !questionContents) {
            alert("모두 입력해주세요.");
            return;
        }

        const questionDay = Date.now().toString();
        const userId = signInUser?.userId;
        const questionStatus = '미응답';
        const answerContents = '';

        if (userId !== undefined) {
            const requestBody: PostQnARequestDto = {
                questionTitle, questionContents, questionDay, userId, questionStatus, answerContents
            };

            PostQnARequest(requestBody, accessToken).then(postQnAResponse);
        } else {
            alert('로그인 정보가 없습니다.');
            return;
        }

    };

    return (
        <div id='qa-write-wrapper'>
            <SupportNavi />
            <div className='top'>
                <div className='questionTitle'>제목</div>
                <input value={questionTitle} type='text' placeholder='제목을 입력해주세요.' onChange={onquestionTitleChangeHandler} />
            </div>
            <div className='main'>
                <div className='questionContents'>내용</div>
                <textarea
                    value={questionContents}
                    placeholder='내용(공백 포함 최소 15글자 입니다.)'
                    onChange={onquestionContentsChangeHandler}
                    minLength={15}
                />
            </div>
            <div className='bottom'>
                <div className='button cancle-button' onClick={onWriteCancleButtonHandler}>취소</div>
                <div className='button write-button' onClick={onWriteRegisterButtonHandler}>등록</div>
            </div>
        </div>
    )
}


