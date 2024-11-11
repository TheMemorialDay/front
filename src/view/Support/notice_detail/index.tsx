import React, { useEffect, useState } from 'react'
import './style.css';
import { useParams } from 'react-router-dom';
import { ResponseDto } from '../../../apis/dto/response';
import { GetNoticeDetailResponseDto } from '../../../apis/dto/response/support';
import formatDate from '../../../components/dateChange/DateChange';
import { getNoticeDetailRequest } from '../../../apis';
import SupportNavi from '../../../components/support_navi';

// component: NoticeDetail 컴포넌트 //
export default function NoticeDetail() {

    // state: 공지 번호 상태 //
    const { noticeNumber } = useParams<{ noticeNumber: string }>();

    // state: 공지 사항 상태 //
    const [title, setTitle] = useState<string>('');
    const [writeDay, setWriteDay] = useState<string>('');
    const [contents, setContents] = useState<string>('');

    // function: notice detail 불러오기 함수 //
    const getNoticeDetail = () => {
        if (noticeNumber) {
            getNoticeDetailRequest(parseInt(noticeNumber)).then(getNoticeDetailResponse);
        }
    };

    // function: get notice detail response 처리 함수 //
    const getNoticeDetailResponse = (responseBody: GetNoticeDetailResponseDto | ResponseDto | null) => {
        console.log('Response received:', responseBody);
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        const { noticeTitle, noticeContents, noticeDay } = responseBody as GetNoticeDetailResponseDto;
        setTitle(noticeTitle);
        setContents(noticeContents);
        setWriteDay(formatDate(noticeDay));
    };

    // effect: 공지 사항 불러오기 이펙트 //
    useEffect(() => {
        console.log('useEffect called with noticeNumber:', noticeNumber);
        getNoticeDetail();
    }, [noticeNumber]);

    // render: NoticeDetail 컴포넌트 렌더링 //
    return (
        <div id='notice-detail-wrapper'>
            {/* <SupportNavi /> */}
            <div className='top' style={{display: "flex", flexDirection: "column", marginTop: "30px"}}>
                <div className='detail-title'>
                    <div className='detail-title-main'>TILTE</div>
                    <div className='detail-title-content'>{title}</div>
                </div>
                <div className='detail-date'>
                    <div className='detail-title-main'>DATE</div>
                    <div className='detail-title-content'>{writeDay}</div>
                </div>
            </div>
            <div className='main'>
                <div className='main-content'>{contents}</div>
            </div>
        </div>
    )
}
