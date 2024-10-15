import { useNavigate } from "react-router-dom";
import { usePagination } from "../../hooks";
import { NoticeList } from "../../types";
import Pagination from "../../components/Pagination";
import React from "react";
import "./style.css";
import { SU_ABSOLUTE_PATH, SU_ABSOLUTE_QA_PATH } from "../../constants";
import Notice from "./notice";

// component: Support 컴포넌트 //
export default function Support() {
    return (
        <div id="support-wrapper">
			<Notice />
        </div>
    );
}
