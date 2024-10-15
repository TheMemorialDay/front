import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SU_ABSOLUTE_PATH, SU_ABSOLUTE_QA_PATH } from '../../constants';
import './style.css';

export default function SupportNavi() {

    // state: 메뉴 상태 //
    const [navSelected, setNavSelected] = useState<string | null>(null);
    // state: 경로 저장 상태 //
    // const [pendingPath, setPendingPath] = useState<string | null>(null);
    
    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // // effect: 선택된 메뉴, 현 메뉴, 경로가 변경되었을 때 경로 변경하고 현 경로 상태를 초기화 //
    // useEffect(() => {
    //     // 만약에 현재 위치 상태가 있다면 그 위치로 경로를 이동시키고 다시 경로를 초기화
    //     if (pendingPath) {
    //         navigator(pendingPath);
    //         setPendingPath(null);
    //     }
    // }, [navSelected, pendingPath, navigator]);

    // event handler: 메뉴 선택 시 경로 이동 및 상태 업데이트 //
    const onMenuClickHandler = (path: string, menu: string) => {
        // 현재 선택된 메뉴랑 위치한 메뉴가 다르다면 다시 선택한 메뉴 & 경로로 변경
            setNavSelected(menu);
            // setPendingPath(path);
            setTimeout(() => {
                navigator(path)
            }, 0);
    };

    return (
        <div id='supportnavi-wrapper'>
            <div className="title">SUPPORT</div>

            <div className="navigation">
                <div 
                    className={`navigation-notice ${navSelected === 'notice' ? 'active' : ''}`} 
                    onClick={() => onMenuClickHandler(SU_ABSOLUTE_PATH, 'notice')}
                >
                    Notice
                </div>
                <div className="navigation-bar">|</div>
                <div 
                    className={`navigation-qa ${navSelected === 'qa' ? 'active' : ''}`} 
                    onClick={() => onMenuClickHandler(SU_ABSOLUTE_QA_PATH, 'qa')}
                >
                    Q&A
                </div>
            </div>
        </div>
    )
}
