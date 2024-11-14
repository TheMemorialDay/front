import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import CompletedOrder from '../../../components/order_completed_box';
import YearSelect from '../../../components/year_select';
import MonthSelect from '../../../components/month_select';
import { FullOrder } from '../../../apis/dto/response/sales/get-sales.response.dto';
import { useSignInUserStore } from '../../../stores';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN } from '../../../constants';
import SalesGraph from './SalesGraph';
import { Autocomplete, TextField } from '@mui/material';

export default function MySales() {
    const { signInUser } = useSignInUserStore();
    const [cookies] = useCookies();
    const accessToken = cookies[ACCESS_TOKEN];
    const [userId, setUserId] = useState<string>('');
    const [salesData, setSalesData] = useState<FullOrder[]>([]);
    const [yearSelected, setYearSelected] = useState<string | null>(null);
    const [monthSelected, setMonthSelected] = useState<string | null>(null);
    const [filteredSalesData, setFilteredSalesData] = useState<FullOrder[]>([]);
    const originalList = useRef<FullOrder[]>([]);

    const yearProps = {
        options: ['2024', '2025', '2026']
    };

    const monthProps = {
        options: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
    };

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
                originalList.current = data.fullOrders;
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
        let salesList = [...originalList.current];

        if (yearSelected) {
            salesList = salesList.filter(item => {
                const year = item.orderTime.slice(0, 4);
                return year === yearSelected;
            });
        }

        if (monthSelected) {
            const selectedMonthNumber = String(monthProps.options.indexOf(monthSelected) + 1).padStart(2, '0');
            salesList = salesList.filter(item => {
                const month = item.orderTime.slice(5, 7);
                return month === selectedMonthNumber;
            });
        }

        setFilteredSalesData(salesList);
    }, [yearSelected, monthSelected, salesData]);

    const completedOrders = filteredSalesData.filter(
        order => order.orderStatus === '완료' || order.orderStatus === '픽업 완료'
    );

    const handleYearOnChange = (event: any, newValue: string | null) => {
        setYearSelected(newValue); // 선택된 값을 상태에 저장
    };
    const handleMonthOnChange = (event: any, newValue: string | null) => {
        setMonthSelected(newValue); // 선택된 값을 상태에 저장
    };

    return (
        <div id='mypage-sales-wrapper'>
            <div className='title'>매출 관리</div>
            <div className='line'></div>
            <SalesGraph salesData={filteredSalesData} selectedMonth={null} />
            <div className='sales-date-box'>
                <Autocomplete
                    {...yearProps}
                    id="include-input-in-list"
                    includeInputInList
                    style={{ minWidth: 150 }}
                    onChange={handleYearOnChange}
                    renderInput={(params) => (
                        <TextField {...params} label="년도 선택" variant="standard" />
                    )}
                />
                <Autocomplete
                    {...monthProps}
                    id="include-input-in-list"
                    includeInputInList
                    style={{ minWidth: 150 }}
                    onChange={handleMonthOnChange}
                    value={yearSelected ? monthSelected : null}
                    renderInput={(params) => (
                        <TextField {...params} label="월 선택" variant="standard" placeholder={yearSelected ? "월 선택" : " "} />
                    )}
                />
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
