import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './style.css';
import { MY_INFO_PATH, MY_REVIEW_PATH, MY_ORDER_DETAIL_PATH, MY_PRODUCT_PATH, MY_ORDER_MANAGE_PATH, MY_SALES_PATH, MY_PASSWORD_CHECK_PATH, ACCESS_TOKEN, MY_STORE_ABSOLUTE_PATH } from '../../constants';
import { useSignInUserStore } from '../../stores';
import { useCookies } from 'react-cookie';

const MyPage = () => {

    const { signInUser } = useSignInUserStore();
    const permission = signInUser?.permission ? signInUser.permission : '';

    // function: 네비게이터 함수 //
    const navigate = useNavigate();

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: 가게 번호 경로 변수 상태 //
    const { storeNumber } = useParams();

    const [userId, setUserId] = useState<string>('');
    const onClickNavigation = (path: string) => {
        navigate(path);
    };

    // effect: 유저 정보 불러오기 함수 //
    useEffect(() => {
        if (signInUser) {
            setUserId(signInUser.userId);
        }

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            alert('접근 권한이 없습니다.');
            return;
        }
    }, [signInUser, storeNumber, userId]);

    // 쿠키에서 accessToken을 추출하는 함수 (TypeScript와 호환되는 코드)
    function getCookie(name: string): string | undefined {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift();
        }
        return undefined;
    }

    // event handler: 가게등록 유무 핸들러 //
    const handleStoreNavigation = async () => {

        try {
            const token = getCookie('accessToken');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/mypage/store/?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache', // 캐시 무효화
                },
            });
            if (response.status === 401) {
                alert('인증 오류: 액세스 토큰이 유효하지 않음');
                return;
            } else if (response.status === 404) {
                alert('해당 userId를 찾을 수 없습니다.');
                return;
            } else if (!response.ok) {
                navigate(MY_STORE_ABSOLUTE_PATH);
                console.error('서버 오류:', response.status);
                return;
            }

            const data = await response.json();
            if (data.storeNumber) {
                navigate(`/mypage/store/${data.storeNumber}`);
            } else {
                navigate(MY_STORE_ABSOLUTE_PATH);
            }
        } catch (error) {
            console.error('API 요청 실패:', error);
        }
    };

    // event handler: 찜목록 핸들러 //
    const handleLikeNavigation = async () => {
        try {
            const token = getCookie('accessToken');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/mypage/like/?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache', // 캐시 무효화
                },
            });
            if (response.status === 401) {
                alert('인증 오류: 액세스 토큰이 유효하지 않음');
                return;
            } else if (response.status === 404) {
                alert('해당 userId를 찾을 수 없습니다.');
                return;
            } else if (!response.ok) {
                console.error('서버 오류:', response.status);
                return;
            }

            const data = await response.json();
            if (userId) {
                navigate(`/mypage/like/${userId}`);
            }
        } catch (error) {
            console.error('API 요청 실패:', error);
        }
    };

    return (
        <div id='myPage'>
            <span className='myPage-title'>MY PAGE</span>
            <div id='general'>
                <div className='userInfo' onClick={() => onClickNavigation(`${MY_INFO_PATH}/${MY_PASSWORD_CHECK_PATH}`)}>
                    <div className='category-icon userInfo'></div>
                    <div className='category-title'>개인정보 관리</div>
                </div>
                <div className='review' onClick={() => onClickNavigation(MY_REVIEW_PATH)}>
                    <div className='category-icon review'></div>
                    <div className='category-title'>리뷰 관리</div>
                </div>
                <div className='order-detail' onClick={() => onClickNavigation(MY_ORDER_DETAIL_PATH)}>
                    <div className='category-icon order-detail'></div>
                    <div className='category-title'>주문 내역</div>
                </div>
                <div className='like' onClick={handleLikeNavigation}>
                    <div className='category-icon like'></div>
                    <div className='category-title'>찜한 가게</div>
                </div>
            </div>
            {permission === '사장' ?
                <div id='ceo'>
                    <div className='store' onClick={handleStoreNavigation}>
                        <div className='category-icon store'></div>
                        <div className='category-title'>가게 관리</div>
                    </div>
                    <div className='product' onClick={() => onClickNavigation(MY_PRODUCT_PATH)}>
                        <div className='category-icon product'></div>
                        <div className='category-title'>상품 관리</div>
                    </div>
                    <div className='order-manage' onClick={() => onClickNavigation(MY_ORDER_MANAGE_PATH)}>
                        <div className='category-icon order-manage'></div>
                        <div className='category-title'>주문 관리</div>
                    </div>
                    <div className='sales' onClick={() => onClickNavigation(MY_SALES_PATH)}>
                        <div className='category-icon sales'></div>
                        <div className='category-title'>매출 관리</div>
                    </div>
                </div>
                :
                ''
            }

        </div>
    );
};

export default MyPage;
