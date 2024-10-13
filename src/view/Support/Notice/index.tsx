import React from "react";
import "./style.css";
import { useLocation, useNavigate } from "react-router-dom";
import { SU_ABSOLUTE_PATH, SU_ABSOLUTE_QA_PATH } from "../../../constants";

// component: Support Notice 컴포넌트 //
export default function Notice() {

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    const { pathname } = useLocation();

    const onItemClickHandler = (path: string) => {
        navigator(path);
    };

    return (
        <div id="notice-wrapper">
        <div className="title">SUPPORT</div>

        <div className="navigation">
            <div className="navigation-notice" onClick={() => onItemClickHandler(SU_ABSOLUTE_PATH)}>Notice</div>
            <div className="navigation-bar">|</div>
            <div className="navigation-qa" onClick={() => onItemClickHandler(SU_ABSOLUTE_QA_PATH)}>Q&A</div>
        </div>

        <div className="top">
            <div className="top-text">전체 12건</div>
        </div>

        <div className="main">
            <div className="table">
            <div className="th">
                <div className="td-no">No.</div>
                <div className="td-title">Title</div>
                <div className="td-date">Date</div>
            </div>

            <div className="tr">
                <div className="td-no">No.</div>
                <div className="td-title">Title</div>
                <div className="td-date">Date</div>
            </div>
            </div>
        </div>

        <div className="bottom">
            <div className="pagination">(페이지네이션 부분)</div>
            <div className="search-box">
            <input placeholder="제목을 입력하세요" />
            <div className="button">검색</div>
            </div>
        </div>
        </div>
    )
}