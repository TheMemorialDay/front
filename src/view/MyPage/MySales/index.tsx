import React, { useEffect, useState } from 'react';
import './style.css';
import CompletedOrder from '../../../components/order_completed_box';
import YearSelect from '../../../components/year_select';
import MonthSelect from '../../../components/month_select';
import { FullOrder } from '../../../apis/dto/response/sales/get-sales.response.dto';
import { useSignInUserStore } from '../../../stores';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN } from '../../../constants';
import SalesGraph from './SalesGraph'; // 그래프 컴포넌트 임포트

export default function MySales() {
    const [salesData, setSalesData] = useState<FullOrder[]>([]); // 전체 매출 데이터
    const { signInUser } = useSignInUserStore();

    const [cookies] = useCookies();
    const accessToken = cookies[ACCESS_TOKEN];
    const [userId, setUserId] = useState<string>('');

    const [yearSelected, setYearSelected] = useState<string | null>(null); // 선택한 년도
    const [monthSelected, setMonthSelected] = useState<string | null>(null); // 선택한 월
    const [filteredSalesData, setFilteredSalesData] = useState<FullOrder[]>([]); // 필터링된 매출 데이터

    useEffect(() => {
        if (signInUser) {
            setUserId(signInUser.userId);
        }
    }, [signInUser]);

    useEffect(() => {
        const fetchSalesData = async () => {

            try {
                const response = await fetch(`http://localhost:4000/mypage/sales?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setSalesData(data.fullOrders); // 서버 응답이 있으면 매출 데이터 설정
            } catch (error) {
                console.error("매출 데이터 가져오기 오류:", error);
            }
        };

        fetchSalesData(); // userId와 accessToken이 모두 있을 때만 호출
    }, [userId, accessToken]); // userId와 accessToken이 변경될 때마다 호출

    useEffect(() => {
        if (yearSelected && monthSelected) {
            // 필터링 로직
            const filteredData = salesData.filter((order) => {
                const orderDate = new Date(order.orderTime);
                const orderYear = orderDate.getFullYear().toString(); // orderTime의 연도를 문자열로 변환
                const orderMonth = (orderDate.getMonth() + 1).toString().padStart(2, '0'); // orderTime의 월을 문자열로 변환

                return orderYear === yearSelected && orderMonth === monthSelected;
            });
            setFilteredSalesData(filteredData);
        } else {
            // 필터링이 없으면 전체 매출 데이터 사용
            setFilteredSalesData(salesData);
        }
    }, [yearSelected, monthSelected, salesData]);

    const completedOrders = filteredSalesData.filter(
        order => order.orderStatus === '완료' || order.orderStatus === '픽업 완료'
    );

    return (
        <div id='mypage-sales-wrapper'>
            <div className='title'>매출 관리</div>
            <div className='line'></div>
            <SalesGraph salesData={filteredSalesData} selectedMonth={null} />
            <div className='sales-date-box'>
                <YearSelect yearSelected={yearSelected} setYearSelected={setYearSelected} />
                <MonthSelect monthSelected={monthSelected} setMonthSelected={setMonthSelected} />
            </div>
            <div className='completed-order-container'>
                {completedOrders.length > 0 ? (
                    completedOrders.map((order, index) => (
                        <CompletedOrder 
                            key={index} 
                            order={{
                                ...order,
                                orderStatus: '완료',
                            }} 
                        />
                    ))
                ) : (
                    <div>선택한 년도와 월에 해당하는 매출 데이터가 없습니다.</div>
                )}
            </div>
        </div>
    );
    
}
