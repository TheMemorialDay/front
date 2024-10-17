import React from 'react'
import SupportNavi from '../../../components/support_navi'
import Pagination from '../../../components/Pagination'
import { QaList } from '../../../types';
import { usePagination } from '../../../hooks';
import './style.css';
interface TableRowProps {
    qas: QaList;
};

// { qas }: TableRowProps
function QaRow() {
    // 데이터 넣은 후 요소 자리에 맞게 넣어주기

    return (
        <>
            <div className="tr">
                <div className="td-no">10</div>
                <div className="td-title">케이크가 주문대로 제작되지 않았습니다.</div>
                <div className="td-writer">홍*동</div>
                <div className="td-date">2024-10-04</div>
                <div className="td-status">대기</div>
            </div>
            {/* 확인용 */}
            <div className="tr">
                <div className="td-no">10</div>
                <div className="td-title">사장님이 주문 수락을 해주지 않아요.</div>
                <div className="td-writer">남*현</div>
                <div className="td-date">2024-10-04</div>
                <div className="td-status">완료</div>
            </div>
        </>
    )

}

// component: support qa 컴포넌트 //
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

    // render: support qa 컴포넌트 렌더링 //
    return (
        <div id="qa-wrapper">
            <SupportNavi />

            {/* 이 부분 따로 가져가서 렌더링 */}
            <div className="top">
                <div className="top-text">전체 12건</div>
                <div className="button write-button">작성</div>
            </div>

            {/* 이 부분도 따로 컴포넌트에 가져가서 렌더링 */}
            <div className="main">

                <div className="table">
                    <div className="th">
                        <div className="td-no">No.</div>
                        <div className="td-title">Title</div>
                        <div className='td-box'>
                            <div className="td-writer">Writer</div>
                            <div className="td-date">Date</div>
                            <div className="td-status">Status</div>
                        </div>
                    </div>

                    <QaRow />

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
