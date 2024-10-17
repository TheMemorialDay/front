import React, { useEffect } from 'react';
import './App.css';

import MainLayout from './layouts/MainLayout';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { HO_PATH, JO_PATH, LOGIN_PATH, OTHERS_PATH, ROOT_ABSOLUTE_PATH, SIGN_UP_PATH, ST_PATH, SU_NOTICE_DETAIL_PATH, SU_PATH, SU_QA_PATH } from './constants';
import Stores from './view/Stores';
import Support from './view/Support';
import Join from './view/Join';
import Auth from './view/Auth';
import SignUp from './view/Auth/signUp';
import Home from './view/Home';
import Qa from './view/Support/qa';
import NoticeDetail from './view/Support/notice_detail';

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
      <Route element={<MainLayout />}>
        <Route path={ST_PATH} element={<Stores />} />

        <Route path={SU_PATH} element={<Support />} />
        <Route path={SU_NOTICE_DETAIL_PATH} element={<NoticeDetail />} />
        <Route path={SU_QA_PATH} element={<Qa />} />

        <Route path={JO_PATH} element={<Join />} />
      </Route>

      <Route path={OTHERS_PATH} element={<Index />} />

      <Route path={LOGIN_PATH} element={<MainLayout />} >
        <Route path={LOGIN_PATH} element={<Auth />} />
        <Route path={SIGN_UP_PATH} element={<SignUp />} />
      </Route>
    </Routes>
  );
}

