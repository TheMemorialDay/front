import { useNavigate } from "react-router-dom";
import { usePagination } from "../../../hooks";
import { NoticeList } from "../../../types";
import Pagination from "../../../components/Pagination";
import './style.css';
import SupportNavi from "../../../components/support_navi";
import { ChangeEvent, useState } from "react";
import { SU_ABSOLUTE_NOTICE_DETAIL_PATH } from "../../../constants";

// interface: 공지사항 리스트 아이템 //
interface TableRowProps {
    notices: NoticeList;
};

// component: NoticeRow 컴포넌트 //
// { notices }: TableRowProps
export function NoticeRow() {
    // 데이터 넣은 후 요소 자리에 맞게 넣어주기

    const navigator = useNavigate();

    const onDetailButtonHandler = () => {
        navigator(SU_ABSOLUTE_NOTICE_DETAIL_PATH);
    };

    // render: NoticeRow 컴포넌트 렌더링 //
    return (
        <>
            <div className="tr" onClick={onDetailButtonHandler}>
                <div className="td-no">10</div>
                <div className="td-title">제 2차 서버 점검이 있습니다.</div>
                <div className="td-date">2024-10-04</div>
            </div>
            {/* 확인용 */}
            <div className="tr">
                <div className="td-no">10</div>
                <div className="td-title">제 2차 서버 점검이 있습니다.</div>
                <div className="td-date">2024-10-04</div>
            </div>
        </>
    )

}

// component: Support Notice 컴포넌트 //
export default function Notice() {

    // state: 검색 입력 창 상태 //
    const [searchWords, setSearchWords] = useState<string>('');
    // state: 원본 리스트 상태 //
    const [originalList, setOriginalList] = useState<NoticeList[]>([]);

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

    // render: Support Notice 렌더링 //
    return (
        <div id="notice-wrapper">
            <SupportNavi />

            {/* 이 부분 따로 가져가서 렌더링 */}
            <div className="top">
                <div className="top-text">전체 12건</div>
            </div>

            {/* 이 부분도 따로 컴포넌트에 가져가서 렌더링 */}
            <div className="main">

                <div className="table">
                    <div className="th">
                        <div className="td-no">No.</div>
                        <div className="td-title">Title</div>
                        <div className="td-date">Date</div>
                    </div>
                
                    <NoticeRow />

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
                    <input value={searchWords} placeholder="제목을 입력하세요" onChange={onSearchChangeHandler} />
                    <div className="button search-button" onClick={onSearchButtonHandler}>검색</div>
                </div>
            </div>
        </div>
    );
}