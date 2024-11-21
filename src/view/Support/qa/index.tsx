import React, { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import SupportNavi from '../../../components/support_navi'
import Pagination from '../../../components/Pagination'
import { QaList } from '../../../types';
import { usePagination } from '../../../hooks';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, LOGIN_PATH, SU_ABSOLUTE_QA_WRITE_PATH, SU_QA_DETAIL_PATH } from '../../../constants';
import QaRow from '../../../components/qa_row';
import { GetQnAListResponseDto } from '../../../apis/dto/response/support';
import { ResponseDto } from '../../../apis/dto/response';
import { useCookies } from 'react-cookie';
import { getQnAListRequest } from '../../../apis';

// component: support qa 컴포넌트 //
export default function Qa() {

    // state: 쿠키 상태 //
    const [cookies] = useCookies();

    // state: 검색 입력 창 상태 //
    const [searchWords, setSearchWords] = useState<string>('');

    // state: 검색어 입력 종류 상태 //
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>('선택');
    const options = ['TITLE', 'WRITER'];

    // state: 원본 리스트 상태 //
    const [originalList, setOriginalList] = useState<QaList[]>([]);

    // function: 네비게이터 //
    const navigator = useNavigate();

    // function: qna list 불러오기 함수 //
    const getQnAList = () => {
        getQnAListRequest().then(getQnAListResponse);
    };

    // function: getNoticeList response 처리 함수 //
    const getQnAListResponse = (responseBody: GetQnAListResponseDto | ResponseDto | null) => {
        const message =
            responseBody === null ? '서버에 문제가 있습니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : 'SU';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { qnas } = responseBody as GetQnAListResponseDto;
        setTotalList(qnas);
        setOriginalList(qnas);
    };

    // function: 드롭 다운 메뉴 토글 함수 //
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

    // event handler: 로우 클릭 시 디테일 페이지로 이동 //
    const onDetailButtonHandler = (questionNumber: number | string) => {
        navigator(SU_QA_DETAIL_PATH(questionNumber));
    };

    // event handler: 검색 입력 창 내용 변경 감지 //
    const onSearchChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchWords(value);
    };

    // event handler: 검색 종류 선택 //
    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
        setIsOpen(false);
    }

    // event handler: 큐엔에이 검색 버튼 //
    const onSearchButtonHandler = () => {
        if (selectedOption === 'TITLE') {
            const searchedList = originalList.filter(qnas => (qnas.questionTitle).includes(searchWords));
            setTotalList(searchedList);
            initViewList(searchedList);
        } else if (selectedOption === 'WRITER') {
            const searchedList = originalList.filter(qnas => (qnas.userId).includes(searchWords));
            setTotalList(searchedList);
            initViewList(searchedList);
        } else {
            alert('검색할 범위를 선택해주세요.');
            return;
        }
    };

    // event handler: 큐엔에이 작성 페이지 이동 //
    const onQaWriteButtonHandler = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            alert("로그인이 필요한 서비스입니다.");
            navigator(LOGIN_PATH);
            return;
        }
        navigator(SU_ABSOLUTE_QA_WRITE_PATH);
    };

    // event handler: 엔터키로 검색 버튼 동작 //
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSearchButtonHandler();
        }
    }

    // 커스텀 훅 가져오기
    const {
        currentPage,
        totalCount,
        viewList,
        pageList,
        setTotalList,
        initViewList,
        onPageClickHandler,
        onPreSectionClickHandler,
        onNextSectionClickHandler,
    } = usePagination<QaList>();

    // effect: 컴포넌트 로드시 찜 리스트 불러오기 함수 //
    useEffect(getQnAList, []);

    // render: support qa 컴포넌트 렌더링 //
    return (
        <div id="qa-wrapper">
            <SupportNavi />

            <div className="top">
                <div className="top-text">전체 {totalCount}건</div>
                <div className="button write-button" onClick={onQaWriteButtonHandler} style={{ marginTop: "30px" }}>작성</div>
            </div>

            <div className="main">

                <div className="table">
                    <div className="th">
                        <div className="td-no">NO</div>
                        <div className="td-title">TITLE</div>
                        <div className='td-box'>
                            <div className="td-writer">WRITER</div>
                            <div className="td-date">DATE</div>
                            <div className="td-status">STATUS</div>
                        </div>
                    </div>

                    {viewList.map((qna, index) => <QaRow key={index} qnas={qna} getQnAList={getQnAList} onDetailClickHandler={onDetailButtonHandler} />)}


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
                    <div className="dropdown-container">
                        <div onClick={toggleDropdown} className="dropdown-button">
                            <div>{selectedOption}</div>
                            <div className={isOpen ? 'arrow-image-down' : 'arrow-image-up'}></div>
                        </div>
                        {isOpen && (
                            <div className="dropdown-menu">
                                {options.map((option, index) => (
                                    <div key={index} className='dropdown-item' onClick={() => handleOptionSelect(option)}>{option}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    <input className="search-input" value={searchWords} placeholder="내용을 입력하세요." onChange={onSearchChangeHandler} onKeyDown={handleKeyDown} />
                    <div className="button search-button" onClick={onSearchButtonHandler}>검색</div>
                </div>
            </div>
        </div>
    )
}
