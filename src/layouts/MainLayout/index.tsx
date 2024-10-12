import React from 'react'
import './style.css';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, HO_ABSOLUTE_PATH, HO_PATH, JO_ABSOLUTE_PATH, JO_PATH, ROOT_ABSOLUTE_PATH, ST_ABSOLUTE_PATH, ST_PATH, SU_ABSOLUTE_PATH, SU_PATH } from '../../constants';

// component: 로고 컴포넌트 //
function Logo() {

    // render: 로고 컴포넌트 렌더링 //
    return (
        <div id='layout-logo'>
            <div className='box'>
                <div className='title'>The Memorial Day</div>
                <div className='icon'></div>
            </div>
        </div>
    );
}

// component: 상단 네비게이션 컴포넌트 //
function TopNavigation() {

    // state: path 상태 //
    const { pathname } = useLocation();

    // variable: 특정 경로 여부 변수 //
    const isSt = pathname.startsWith(ST_PATH);
    const isHo = pathname.startsWith(HO_PATH);
    const isSu = pathname.startsWith(SU_PATH);
    const isJo = pathname.startsWith(JO_PATH);

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 네비케이션 아이템 클릭 이벤트 //
    const onItemClickHandler = (path: string) => {
        navigator(path);
    };

    // render: 상단 네비게이션 컴포넌트 //
    return (
        <div id='layout-top-navigation'>
            <div className='navigation'>
                <div className={`navigation-item ${isSt ? 'active' : ''}`} onClick={() => onItemClickHandler(ST_ABSOLUTE_PATH)}>
                    <div className='item-text'>STORES</div>
                </div>
                <div className={`navigation-item ${isHo ? 'active' : ''}`} onClick={() => onItemClickHandler(HO_ABSOLUTE_PATH)}>
                    <div className='item-text'>HOW</div>
                </div>
                <div className={`navigation-item ${isSu ? 'active' : ''}`} onClick={() => onItemClickHandler(SU_ABSOLUTE_PATH)}>
                    <div className='item-text'>SUPPORT</div>
                </div>
                <div className={`navigation-item ${isJo ? 'active' : ''}`} onClick={() => onItemClickHandler(JO_ABSOLUTE_PATH)}>
                    <div className='item-text'>JOIN</div>
                </div>
            </div>
        </div>
    );
}



// component: 상단 네비게이션 컴포넌트 //
function TopPersonalNavigation() {

    // state: path 상태 //
    const { pathname } = useLocation();

    // state: cookie 상태 //
    const [cookies, setCookie, removeCookie] = useCookies();


    // render: 상단 컴포넌트 //
    return (
        <div id='layout-my'>
            <div className='layout-my-icon'>사람<br />아이콘</div>
            <div className='layout-my-cart'>카트<br />아이콘</div>
        </div>
    );
}


// component: 메인 레이아웃 컴포넌트 //
export default function MainLayout() {

    // function: 네비데이터 함수 //
    const navigator = useNavigate();

    return (
        <div id='main-layout'>
            <div className='category'>
                <Logo />
                <TopNavigation />
                <TopPersonalNavigation />
            </div>
            <div id='main-wrapper'>
                <Outlet />
            </div>
        </div>
    )
}
