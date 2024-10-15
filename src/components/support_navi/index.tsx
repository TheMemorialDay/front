import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SU_ABSOLUTE_PATH, SU_ABSOLUTE_QA_PATH } from '../../constants';
import './style.css';

export default function SupportNavi() {

    // state: 메뉴 상태 //
    const [navSelected, setNavSelected] = useState<boolean>(false);

    // event handler: 메뉴 상태 변경 //
    const onNavChangeHandler = () => {
        setNavSelected(!navSelected);
    };

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 클릭 시 메뉴 이동 //
    const onItemClickHandler = (path: string) => {
        navigator(path);
    };

    return (
        <div id='supportnavi-wrapper'>
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
        </div>
    )
}
