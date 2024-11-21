import React, { useEffect, useState } from 'react'
import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import { ACCESS_TOKEN, SU_ABSOLUTE_QA_PATH } from '../../../constants';
import { GetQnADetailResponseDto } from '../../../apis/dto/response/support';
import { ResponseDto } from '../../../apis/dto/response';
import maskString from '../../../components/maskingString/MaskingString';
import { useSignInUserStore } from '../../../stores';
import { useCookies } from 'react-cookie';
import { deleteQnARequest, getQnADetailRequest } from '../../../apis';

// component: Q&A Detail 컴포넌트 //
export default function QaDetail() {

    // state: cookie state //
    const [cookies] = useCookies();

    // state: 로그인 유저 상태 //
    const { signInUser } = useSignInUserStore();

    // state: 질문 번호 //
    const { questionNumber } = useParams<{ questionNumber: string }>();

    // state: qna 관련 변수 상태 //
    const [writerId, setWriterId] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [questionContents, setQuestionContents] = useState<string>('');
    const [answerContents, setAnswerContents] = useState<string | undefined>('');
    const [writeDay, setWriteDay] = useState<string>('');

    // state: 답변 여부 상태 //
    const [hasAnswer, setHasAnswer] = useState<boolean>(false);

    // function: 네비게이터 //
    const navigator = useNavigate();

    // function: qna detail 불러오기 함수 //
    const getQnADetail = () => {
        if (questionNumber) {
            getQnADetailRequest(questionNumber).then(getQnADetailResponse);
        }
    };

    // function: get notice detail response 처리 함수 //
    const getQnADetailResponse = (responseBody: GetQnADetailResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        const { questionTitle, questionDay, questionContents, userId, answerContents, questionStatus } = responseBody as GetQnADetailResponseDto;
        setTitle(questionTitle);
        setWriterId(userId);
        setQuestionContents(questionContents);

        const date = new Date(questionDay);
        date.setHours(date.getHours() + 9);
        const newDate = date.toISOString(); // 또는 원하는 형식으로 변환
        setWriteDay(newDate);

        if (questionStatus === '미응답') {
            setHasAnswer(false);
        } else {
            setHasAnswer(true);
            setAnswerContents(answerContents);
        }
    };

    // function: delete QnA response 처리 함수 //
    const deleteQnAResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'AF' ? '접근 권한이 없습니다.' :
                    responseBody.code === 'NP' ? '접근 권한이 없습니다.' :
                        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : 'SU';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        navigator(SU_ABSOLUTE_QA_PATH);
        window.location.reload();
    }

    // event handler: 삭제 버튼 //
    const onDeleteButtonHandler = () => {
        const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
        if (!isConfirm) return;

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        if (!questionNumber) {
            alert('유효한 질문 번호가 없습니다.');
            return;
        }

        deleteQnARequest(questionNumber, accessToken).then(deleteQnAResponse);
    };

    // variable: 로그인 유저 상태 //
    const isUser = signInUser?.userId !== undefined && signInUser?.userId === writerId;

    // effect: 공지 사항 불러오기 이펙트 //
    useEffect(() => {
        getQnADetail();
    }, [questionNumber]);

    // render: Q&A Detail 컴포넌트 렌더링 //
    return (
        <div id='qa-detail-wrapper' style={{ marginTop: "30px" }}>
            <div className='write-info-box' >
                <div className='writer-box'>
                    <div className='writer-title'>WRITER</div>
                    <div className='writer'>{maskString(writerId)}</div>
                </div>
                <div className='write-date-box'>
                    <div className='write-date-title'>DATE</div>
                    <div className='write-date'>{writeDay.substring(0, 10)}</div>
                </div>
            </div>

            <div className='subject-box'>
                <div className='subject-title'>TITLE</div>
                <div className='subject-text'>{title}</div>
            </div>

            <div className='script-box'>
                <div className='script-title'>CONTENTS</div>
                <div className='script-text'>{questionContents}</div>
            </div>

            <div className='line'></div>

            {hasAnswer &&
                <div className='answer-box'>
                    <div className='answer-title'>ANSWER</div>
                    <div className='answer-text'>{answerContents}</div>
                </div>
            }

            {isUser ?
                <div className='button-box'>
                    <div className='button delete-button' onClick={onDeleteButtonHandler}>삭제</div>
                </div>
                :
                ''
            }
        </div>
    )
}
