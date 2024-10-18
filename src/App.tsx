import React, { useEffect } from 'react';
import './App.css';

import MainLayout from './layouts/MainLayout';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { JO_PATH, LOGIN_PATH, OTHERS_PATH, ROOT_ABSOLUTE_PATH, SIGN_UP_PATH, ST_CONTACT_DETAIL_PATH, ST_INFORMATION_DETAIL_PATH, ST_ORDER_DETAIL_PATH, ST_PATH, ST_REVIEW_DETAIL_PATH, SU_PATH, SU_QA_PATH } from './constants';
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


  //function: 네비게이터 함수 //
  const navigator = useNavigate();

  return (
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
      </Route>
      <Route path={SU_PATH} element={<MainLayout />}  >
        <Route path={SU_PATH} element={<Support />} />
        <Route path={SU_QA_PATH} element={<Qa />} />
      </Route>
    </Routes>
  );
}

