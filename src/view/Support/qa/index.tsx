import React, { ChangeEvent, useState } from 'react'
import SupportNavi from '../../../components/support_navi'
import Pagination from '../../../components/Pagination'
import { QaList } from '../../../types';
import { usePagination } from '../../../hooks';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { SU_ABSOLUTE_QA_WRITE_PATH } from '../../../constants';
import QaRow from '../../../components/qa_row';

// component: support qa 컴포넌트 //
export default function Qa() {

    // function : 네비게이터 //
    const navigator = useNavigate();

    // state: 검색 입력 창 상태 //
    const [searchWords, setSearchWords] = useState<string>('');
    // state: 원본 리스트 상태 //
    const [originalList, setOriginalList] = useState<QaList[]>([]);

    // event handler: 검색 입력 창 내용 변경 감지 //
    const onSearchChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchWords(value);
    };

    // event handler: 큐엔에이 검색 버튼 //
    const onSearchButtonHandler = () => {
        const searchedList = originalList.filter(qa => (qa.questionTitle, qa.name).includes(searchWords));
        setTotalList(searchedList);
        initViewList(searchedList);
    }; 

    // event handler: 큐엔에이 작성 페이지 이동 //
    const onQaWriteButtonHandler = () => {
        navigator(SU_ABSOLUTE_QA_WRITE_PATH);
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
    } = usePagination<QaList>();

    // render: support qa 컴포넌트 렌더링 //
    return (
        <div id="qa-wrapper">
            <SupportNavi />

            <div className="top">
                <div className="top-text">전체 12건</div>
                <div className="button write-button" onClick={onQaWriteButtonHandler}>작성</div>
            </div>

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
                    <input value={searchWords} placeholder="제목을 입력하세요" onChange={onSearchChangeHandler} />
                    <div className="button search-button" onClick={onSearchButtonHandler}>검색</div>
                </div>
            </div>
        </div>
    )
}
