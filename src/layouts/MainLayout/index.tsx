import React, { useState } from 'react'
import './style.css';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, HO_ABSOLUTE_PATH, HO_PATH, JO_ABSOLUTE_PATH, JO_PATH, LOGIN_PATH, ROOT_ABSOLUTE_PATH, ROOT_PATH, SHOPPING_CART_ABSOLUTE_PATH, SIGN_UP_PATH, ST_ABSOLUTE_PATH, ST_PATH, SU_ABSOLUTE_PATH, SU_PATH } from '../../constants';

// component: 로고 컴포넌트 //
function Logo() {

    // state: path 상태 //
    const { pathname } = useLocation();

    // variable: 특정 경로 여부 변수 //
    const isHome = pathname.startsWith(ROOT_PATH);
    
    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 네비케이션 아이템 클릭 이벤트 //
    const onItemClickHandler = (path: string) => {
        navigator(path);
    };
    

    // render: 로고 컴포넌트 렌더링 //
    return (
        <div id='layout-logo'>
            <div className='box'>
                <div className={`title ${isHome ? 'active' : ''}`} onClick={() => onItemClickHandler(ROOT_ABSOLUTE_PATH)}>The Memorial Day</div>
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

    // event handler: 네비게이션 아이템 클릭 이벤트 //
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
                <a className={`navigation-item ${isHo ? 'active' : ''}`} aria-hidden="true" href="#read"  onClick={() => onItemClickHandler(HO_ABSOLUTE_PATH)}>
                    <div className='item-text'>HOW</div>
                </a>
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
    const accessToken = cookies[ACCESS_TOKEN];

    // state: hovering 상태 //
    const [isHovered, setIsHovered] = useState(false);

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 사람 아이콘 버튼 클릭 이벤트 //
    const onLogInClickHandler = () => {
        navigator(LOGIN_PATH);
    }

    // event handler: 회원가입 버튼 //
    const onSignUpClickHandler = () => {
        navigator(SIGN_UP_PATH);
    }

    // event Handler: 로그아웃 버튼 클릭 이벤트 처리 //
    const onLogoutButtonClickHandler = () => {
        removeCookie(ACCESS_TOKEN, {path:ROOT_ABSOLUTE_PATH});
        navigator(ROOT_ABSOLUTE_PATH);
    };

    // event handler: 장바구니 아이콘 클릭 //
    const onShoppingCartIconClickHandler = () => {
        navigator(SHOPPING_CART_ABSOLUTE_PATH);
    };

    // render: 상단 컴포넌트 //
    return (
        <div id='layout-my'>
            <div 
                className='layout-my-icon' 
                onMouseEnter={() => setIsHovered(true)}></div>
            <div className='layout-my-cart' onClick={onShoppingCartIconClickHandler}></div>
        
            {isHovered && (
                <div className='menu-box'
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}>
                    {!accessToken && 
                        <div>
                            <div className='menu' onClick={onLogInClickHandler}>로그인</div>
                            <div className='menu' onClick={onSignUpClickHandler}>회원가입</div>
                        </div>
                    }
                    {accessToken &&
                        <div>
                            <div className='menu' onClick={onLogoutButtonClickHandler}>로그아웃</div>
                            <div className='menu' onClick={() => navigator('/mypage')}>마이페이지</div>
                        </div>
                    }
                    
                </div>
            )}
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
