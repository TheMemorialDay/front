import React from "react";
import "./style.css";
import MainLayout from "../../layouts/MainLayout";

// component: Support Notice 컴포넌트 //
function Notice() {
    return (
        <div id="notice-wrapper">
        <div className="title">SUPPORT</div>

        <div className="navigation">
            <div className="navigation-notice">Notice</div>
            <div className="navigation-bar">|</div>
            <div className="navigation-qa">Q&A</div>
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

// component: Support 컴포넌트 //
export default function Support() {
    return (
        <div id="support-wrapper">
            <MainLayout />
            <Notice />
            테스트
        </div>
    );
}
