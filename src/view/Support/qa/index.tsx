import React from 'react'
import SupportNavi from '../../../components/support_navi'
import Pagination from '../../../components/Pagination'
import { QaList } from '../../../types';
import { usePagination } from '../../../hooks';
import './style.css';


export default function Qa() {

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
    } = usePagination<QaList>();

    return (
        <div id="qa-wrapper">
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
    )
}
