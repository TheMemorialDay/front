import React, { useEffect, useState } from 'react';
import './App.css';

import MainLayout from './layouts/MainLayout';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { JO_PATH, LOGIN_PATH, OTHERS_PATH, ROOT_ABSOLUTE_PATH, SIGN_UP_PATH, ST_CONTACT_DETAIL_PATH, 
  ST_INFORMATION_DETAIL_PATH, ST_ORDER_DETAIL_PATH, ST_PATH, ST_REVIEW_DETAIL_PATH, SU_PATH, SU_QA_PATH, 
  SU_NOTICE_DETAIL_PATH, SU_QA_WRITE_PATH, SU_QA_DETAIL_PATH, JOIN_OKAY_PATH, SHOPPING_CART_PATH, MY_PATH, 
  MY_INFO_PATH, MY_REVIEW_PATH, MY_ORDER_DETAIL_PATH, MY_LIKE_PATH, MY_STORE_PATH, MY_PRODUCT_PATH, 
  MY_ORDER_MANAGE_PATH, MY_SALES_PATH, MY_PASSWORD_CHECK_PATH, MY_PRODUCT_ADD_PATH, 
  MY_PRODUCT_UPDATE_PATH} from './constants';

import Stores from './view/Stores';
import Support from './view/Support';
import Join from './view/Join';
import Auth from './view/Auth';
import SignUp from './view/Auth/signUp';
import Home from './view/Home';
import Qa from './view/Support/qa';
import ShopOrder from './view/Stores/Order';
import ShopInformation from './view/Stores/Information';
import ShopContact from './view/Stores/Contact';
import ShopReview from './view/Stores/Review';
import MyPage from './view/MyPage';
import InfoUpdate from './view/MyPage/MyInfo';
import MyReview from './view/MyPage/MyReview';
import MyOrder from './view/MyPage/MyOrderDetail';
import MyLike from './view/MyPage/MyLike';
import MyProduct from './view/MyPage/MyProduct';
import MyStore from './view/MyPage/MyStore';
import MyOrderManage from './view/MyPage/MyOrderManage';
import MySales from './view/MyPage/MySales';
import NoticeDetail from './view/Support/notice_detail';
import QaWrite from './view/Support/qa_write';
import QaDetail from './view/Support/qa_detail';
import OkayScreen from './view/Join/okScreen';
import ShoppingCart from './view/shopping_cart';
import Update from './view/MyPage/MyProduct/update';
import MyPasswordCheck from './view/MyPage/MyInfo/MyPasswordCheck';
import { useCookies } from 'react-cookie';
import NotMember from './components/Modal/NotMember';

// component: root path 컴포넌트 //
function Index() {

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  useEffect(() => {
    navigator(ROOT_ABSOLUTE_PATH);
  }, []);

  // render: root path 컴포넌트 렌더링 //

  return (
    <>
      <Home />
    </>
  );
}

// component: TheMemorialDay 컴포넌트 //
export default function TheMemorialDay() {
  const [cookies] = useCookies(['ACCESS_TOKEN']);
  const isLoggedIn = Boolean(cookies.ACCESS_TOKEN);
  const [showNotMemberModal, setShowNotMemberModal] = useState(false);
  const navigator = useNavigate();

  const handleNotMemberModalClose = () => {
      setShowNotMemberModal(false);
  };

  const handleNotMemberModalConfirm = () => {
    setShowNotMemberModal(false);
      navigator(LOGIN_PATH); // 로그인 페이지로 이동
  };

  return (
    <>
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Index />} />
      </Route>
      <Route path={ST_PATH} element={<MainLayout />}>
        <Route index element={<Stores />} />
        <Route path={ST_PATH} element={<Stores />} />
        <Route path={ST_ORDER_DETAIL_PATH} element={<ShopOrder />} />
        <Route path={ST_INFORMATION_DETAIL_PATH} element={<ShopInformation />} />
        <Route path={ST_CONTACT_DETAIL_PATH} element={<ShopContact />} />
        <Route path={ST_REVIEW_DETAIL_PATH} element={<ShopReview />} />
      </Route>
      <Route path={OTHERS_PATH} element={<Index />} />
      <Route path={LOGIN_PATH} element={<MainLayout />} >
        <Route path={LOGIN_PATH} element={<Auth />} />
        <Route path={SIGN_UP_PATH} element={<SignUp />} />
      </Route>
      <Route path={JO_PATH} element={<MainLayout />}  >
        <Route path={JO_PATH} element={<Join />} />
        <Route path={JOIN_OKAY_PATH} element={<OkayScreen />} />
      </Route>
      <Route path={SU_PATH} element={<MainLayout />}  >
        <Route path={SU_PATH} element={<Support />} />
        <Route path={SU_NOTICE_DETAIL_PATH(':noticeNumber')} element={<NoticeDetail />} />
        <Route path={SU_QA_PATH} element={<Qa />} />
        <Route path={SU_QA_WRITE_PATH} element={<QaWrite />} />
        <Route path={SU_QA_DETAIL_PATH(':questionNumber')} element={<QaDetail />} />
      </Route>
      <Route path={SHOPPING_CART_PATH} element={<MainLayout />} >
        <Route path={SHOPPING_CART_PATH} element={<ShoppingCart />} />
      </Route>
      <Route path={MY_PATH} element={<MainLayout />}  >
        <Route path={MY_PATH} element={<MyPage />} />
        <Route path={MY_INFO_PATH} >
          <Route index element={<InfoUpdate />} />
        <Route path={MY_PASSWORD_CHECK_PATH} element={<MyPasswordCheck />} />
        </Route>
        <Route path={MY_REVIEW_PATH} element={<MyReview />} />
        <Route path={MY_ORDER_DETAIL_PATH} element={<MyOrder />} />
        <Route path={MY_LIKE_PATH} element={<MyLike />} />
        <Route path={MY_STORE_PATH} element={<MyStore />} />

        <Route path={MY_PRODUCT_PATH}>
          <Route index element={<MyProduct />} />
          <Route path={MY_PRODUCT_ADD_PATH} element={<Update/>} /> 
          <Route path={MY_PRODUCT_UPDATE_PATH} element={<Update />} />
        </Route>

        <Route path={MY_ORDER_MANAGE_PATH} element={<MyOrderManage />} />
        <Route path={MY_SALES_PATH} element={<MySales />} />
      </Route>
    </Routes>
    {showNotMemberModal && (
                <NotMember
                    onClose={handleNotMemberModalClose}
                    onConfirm={handleNotMemberModalConfirm}
                />
            )}
    </>
    
  );

}

