import React, { useEffect } from 'react';
import './App.css';

import MainLayout from './layouts/MainLayout';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { HO_PATH, JO_PATH, OTHERS_PATH, ROOT_ABSOLUTE_PATH, ST_PATH, SU_PATH } from './constants';
import Support from './view/Support';

// component: root path 컴포넌트 //
function Index() {

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    useEffect(() => {
        navigator(ROOT_ABSOLUTE_PATH);
    }, []);

    // render: root path 컴포넌트 렌더링 //

    return (
        <></>
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
                {/* <Route path={ROOT_ABSOLUTE_PATH} element={<MainLayout />} /> */}
            </Route>
            <Route path={ST_PATH} element={<MainLayout />} />
            <Route path={HO_PATH} element={<MainLayout />} />
            <Route path={SU_PATH} element={<MainLayout />} >
                <Route path={SU_PATH} element={<Support />} />
            </Route>



            <Route path={JO_PATH} element={<MainLayout />} />
            <Route path={OTHERS_PATH} element={<Index />} />
        </Routes>
    );
}

