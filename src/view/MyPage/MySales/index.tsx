import React, { useEffect, useState } from 'react';
import './style.css';
import CompletedOrder from '../../../components/order_completed_box';
import YearSelect from '../../../components/year_select';
import MonthSelect from '../../../components/month_select';
import { FullOrder } from '../../../apis/dto/response/sales/get-sales.response.dto';
import { useSignInUserStore } from '../../../stores';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN } from '../../../constants';
import SalesGraph from './SalesGraph';

export default function MySales() {
    const { signInUser } = useSignInUserStore();
    const [cookies] = useCookies();
    const accessToken = cookies[ACCESS_TOKEN];
    const [userId, setUserId] = useState<string>('');
    const [salesData, setSalesData] = useState<FullOrder[]>([]);
    const [yearSelected, setYearSelected] = useState<string | null>(null);
    const [monthSelected, setMonthSelected] = useState<string | null>(null);
    const [filteredSalesData, setFilteredSalesData] = useState<FullOrder[]>([]);

    useEffect(() => {
        if (signInUser) {
            setUserId(signInUser.userId);
        }
    }, [signInUser]);

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

            // 응답에서 fullOrders를 사용하여 salesData 설정
            if (data && data.fullOrders) {
                setSalesData(data.fullOrders);
            } else {
                console.error('서버 응답에 fullOrders가 없음:', data);
                setSalesData([]); // 빈 배열로 설정
            }
        } catch (error) {
            console.error("매출 데이터 가져오기 오류:", error);
            setSalesData([]); // 오류 발생 시 빈 배열로 설정
        }
    };

    useEffect(() => {
        if (userId && accessToken) {
            fetchSalesData();
        }
    }, [userId, accessToken]);

    useEffect(() => {
        if (yearSelected && monthSelected) {
            const filteredData = salesData.filter((order) => {
                const orderDate = new Date(order.orderTime);
                const orderYear = orderDate.getFullYear().toString();
                const orderMonth = (orderDate.getMonth() + 1).toString().padStart(2, '0');

                return orderYear === yearSelected && orderMonth === monthSelected;
            });
            setFilteredSalesData(filteredData);
        } else {
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
                            order={{ ...order, orderStatus: '완료' }} 
                        />
                    ))
                ) : (
                    <div>선택한 년도와 월에 해당하는 매출 데이터가 없습니다.</div>
                )}
            </div>
        </div>
    );
}
