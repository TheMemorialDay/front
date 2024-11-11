import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { SU_ABSOLUTE_PATH, SU_ABSOLUTE_QA_PATH } from '../../constants';
import './style.css';

export default function SupportNavi() {

    // state: 경로 저장 상태 //
    const {pathname} = useLocation();

    // variable: 특정 경로 여부 변수 //
    const isNotice = pathname.endsWith(SU_ABSOLUTE_PATH);
    const isQa = pathname.endsWith(SU_ABSOLUTE_QA_PATH);

    // function: 네비게이터 //
    const navigator = useNavigate();

    // event handler: 경로 이동 //
    const onItemClickHandler = (path: string) => {
        navigator(path);
    };

    return (
        <div id='supportnavi-wrapper'>
            <div className="navigation">
                <div 
                    className={`navigation-notice ${ isNotice ? 'active' : ''}`} 
                    onClick={() => onItemClickHandler(SU_ABSOLUTE_PATH)}
                >Notice</div>
                <div className="navigation-bar" style={{fontSize: "17px"}}>|</div>
                <div 
                    className={`navigation-qa ${ isQa ? 'active' : ''}`} 
                    onClick={() => onItemClickHandler(SU_ABSOLUTE_QA_PATH)}
                >
                    Q&A
                </div>
            </div>
        </div>
    )
}
