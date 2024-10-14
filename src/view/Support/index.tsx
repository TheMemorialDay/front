import { useLocation, useNavigate } from "react-router-dom";
import { usePagination } from "../../hooks";
import { NoticeList } from "../../types";
import { SU_ABSOLUTE_PATH, SU_ABSOLUTE_QA_PATH } from "../../constants";
import Pagination from "../../components/Pagination";
import React from "react";
import "./style.css";

// component: Support Notice 컴포넌트 //
function Notice() {
    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: 로케이션 함수 //
    const { pathname } = useLocation();

    // event handler: 클릭 시 경로 이동 이벤트 처리 함수 //
    const onItemClickHandler = (path: string) => {
        navigator(path);
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
            <div className="title">SUPPORT</div>

            <div className="navigation">
                <div
                    className="navigation-notice"
                    onClick={() => onItemClickHandler(SU_ABSOLUTE_PATH)}
                >
                    Notice
                </div>
                <div className="navigation-bar">|</div>
                <div
                    className="navigation-qa"
                    onClick={() => onItemClickHandler(SU_ABSOLUTE_QA_PATH)}
                >
                    Q&A
                </div>
            </div>

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

                    <div className="tr">
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
                    <input placeholder="제목을 입력하세요" />
                    <div className="button search-button">검색</div>
                </div>
            </div>
        </div>
    );
}

// component: Support qa 컴포넌트 //
function Qa() {
    // render: Support qa 렌더링 //
    return <div id="qa-wrapper"></div>;
}

// component: Support 컴포넌트 //
export default function Support() {
    return (
        <div id="support-wrapper">
            <Notice />
        </div>
    );
}
