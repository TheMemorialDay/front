import { useNavigate } from "react-router-dom";
import { usePagination } from "../../../hooks";
import { NoticeList } from "../../../types";
import Pagination from "../../../components/Pagination";
import './style.css';
import SupportNavi from "../../../components/support_navi";
import { ChangeEvent, useEffect, useState } from "react";
import { SU_ABSOLUTE_NOTICE_DETAIL_PATH } from "../../../constants";
import GetNoticeListResponseDto from "../../../apis/dto/response/support/get-notice-list-response.dto";
import { ResponseDto } from "../../../apis/dto/response";
import formatDate from "../../../components/dateChange/DateChange";
import { getNoticeListRequest } from "../../../apis";


// interface: 공지사항 리스트 아이템 //
interface TableRowProps {
    notice: NoticeList;
    getNoticeList: () => void;
    onDetailClickHandler: (noticeNumber: number) => void;
};

// component: NoticeRow 컴포넌트 //

export function NoticeRow({ notice, getNoticeList, onDetailClickHandler }: TableRowProps) {

    // render: NoticeRow 컴포넌트 렌더링 //
    return (
        <div className="tr" onClick={() => onDetailClickHandler(notice.noticeNumber)}>
            <div className="td-no">{notice.noticeNumber}</div>
            <div className="td-title">{notice.noticeTitle}</div>
            <div className="td-date">{formatDate(notice.noticeDay)}</div>
        </div>
    )
}

// component: Support Notice 컴포넌트 //
export default function Notice() {

    // state: 검색 입력 창 상태 //
    const [searchWords, setSearchWords] = useState<string>('');
    // state: 원본 리스트 상태 //
    const [originalList, setOriginalList] = useState<NoticeList[]>([]);

    // function: 네비게이터 //
    const navigator = useNavigate();

    // function: notice list 불러오기 함수 //
    const getNoticeList = () => {
        getNoticeListRequest().then(getNoticeListResponse);
    };

    // function: getNoticeList response 처리 함수 //
    const getNoticeListResponse = (responseBody: GetNoticeListResponseDto | ResponseDto | null) => {
        const message =
            responseBody === null ? '서버에 문제가 있습니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : 'SU';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { notices } = responseBody as GetNoticeListResponseDto;
        setTotalList(notices);
        setOriginalList(notices);
    };

    // event handler: 공지사항 tr 클릭 이벤트 핸들러 //
    const onTrClickHandler = (noticeNumber: number) => {
        navigator(SU_ABSOLUTE_NOTICE_DETAIL_PATH(noticeNumber));
    }

    // event handler: 검색 입력 창 내용 변경 감지 //
    const onSearchChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchWords(value);
    };

    // event handler: 공지사항 검색 버튼 //
    const onSearchButtonHandler = () => {
        const searchedList = originalList.filter(notice => notice.noticeTitle.includes(searchWords));
        setTotalList(searchedList);
        initViewList(searchedList);
    };

    // event handler: 엔터키로 검색 버튼 동작 //
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSearchButtonHandler();
        }
    }

    //* 커스텀 훅 가져오기
    const {
        currentPage,
        totalPage,
        totalCount,
        viewList,
        pageList,
        setTotalList,
        initViewList,
        onPageClickHandler,
        onPreSectionClickHandler,
        onNextSectionClickHandler,
    } = usePagination<NoticeList>();

    // effect: 컴포넌트 로드시 용품 리스트 불러오기 함수 //
    useEffect(getNoticeList, []);

    // render: Support Notice 렌더링 //
    return (
        <div id="notice-wrapper">
            <SupportNavi />

            <div className="top">
                <div className="top-text">전체 {totalCount}건</div>
            </div>

            <div className="main">
                <div className="table">
                    <div className="th">
                        <div className="td-no">NO</div>
                        <div className="td-title">TITLE</div>
                        <div className="td-date">DATE</div>
                    </div>
                    {viewList.map((notice, index) => <NoticeRow key={index} notice={notice} getNoticeList={getNoticeList} onDetailClickHandler={onTrClickHandler} />)}
                </div>
            </div>

            <div className="bottom">
                <Pagination
                    pageList={pageList}
                    currentPage={currentPage}
                    onPageClickHandler={onPageClickHandler}
                    onPreSectionClickHandler={onPreSectionClickHandler}
                    onNextSectionClickHandler={onNextSectionClickHandler}
                />
                <div className="search-box">
                    <input value={searchWords} placeholder="제목을 입력하세요" onChange={onSearchChangeHandler} onKeyDown={handleKeyDown} />
                    <div className="button search-button" onClick={onSearchButtonHandler}>검색</div>
                </div>
            </div>
        </div>
    );
}