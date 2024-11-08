import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Legend as PieLegend } from 'recharts';

const SalesGraph = ({ salesData, selectedMonth }: { salesData: any[]; selectedMonth: string | null }) => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [orderStatusData, setOrderStatusData] = useState<{ [key: string]: number }>({}); // 주문 상태별 데이터 초기화

    useEffect(() => {
        if (salesData.length > 0) {
            // 월별 매출 총합 계산
            const monthlySales = salesData.reduce((acc, order) => {
                const orderDate = new Date(order.orderTime);
                const month = orderDate.getMonth() + 1; // 1부터 시작하는 월
                if (!acc[month]) {
                    acc[month] = 0;
                }
                acc[month] += order.totalPrice;
                return acc;
            }, {} as { [key: number]: number });

            // 차트에 맞는 데이터 형식으로 변환 (1~12월 모두 표시)
            const formattedData = Array.from({ length: 12 }, (_, index) => {
                const month = index + 1; // 월은 1부터 12까지
                return {
                    date: month.toString(),
                    매출: monthlySales[month] || 0,
                };
            });

            setChartData(formattedData);

            // 주문 상태별 주문 수 계산
            const statusData = salesData.reduce((acc, order) => {
                if (!acc[order.orderStatus]) {
                    acc[order.orderStatus] = 0;
                }
                acc[order.orderStatus] += 1; // 각 주문 상태별 건수 증가
                return acc;
            }, {} as { [key: string]: number });

            setOrderStatusData(statusData); // 주문 상태별 데이터 업데이트
        }
    }, [salesData]);

    // 월 강조 스타일 적용
    const getLineStroke = (month: string) => {
        return month === selectedMonth ? { strokeWidth: 3, stroke: '#9b5bcf' } : { strokeWidth: 2, stroke: '#d3a3e8' };
    };

    // X축의 범위 설정 (선택된 월을 중심으로)
    const domain = selectedMonth 
        ? [Math.max(Number(selectedMonth) - 1, 0), Math.min(Number(selectedMonth) + 1, 11)] 
        : [0, 11];

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '30px' }}>
            {/* Sales Graph */}
            <div className="sales-graph-box" style={{ flex: 2 }}>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="date" 
                                label={{ position: 'bottom', fontSize: 14 }}
                                tick={{ fontSize: 14 }}
                                domain={domain}
                            />
                            <YAxis 
                                label={{ angle: -90, position: 'left', fontSize: 14 }}
                                tick={{ fontSize: 14 }}
                            />
                            <Tooltip contentStyle={{ fontSize: '12px', padding: '8px' }} />
                            <Legend layout="vertical" verticalAlign="bottom" wrapperStyle={{ fontSize: 12 }} />
                            <Line type="monotone" dataKey="매출" {...getLineStroke(selectedMonth || '')} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div>매출 데이터가 없습니다.</div>
                )}
            </div>

            {/* Order Status Pie Chart */}
            <div className="order-status-pie" style={{ flex: 1 }}>
                {Object.keys(orderStatusData).length > 0 && (
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={Object.keys(orderStatusData).map((status) => ({
                                    name: status,
                                    value: orderStatusData[status],
                                }))}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                fill="#8884d8"
                            >
                                {Object.keys(orderStatusData).map((status, index) => (
                                    <Cell key={index} fill={[ '#7a3bc3', '#9b5bcf', '#b88bdc', '#d3a3e8',][index % 4]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            {/* Pie 그래프의 범례 위치를 그래프 아래로 이동 */}
                            <PieLegend
                                iconType="circle"
                                layout="vertical"
                                verticalAlign="bottom"  // 범례를 하단으로 이동
                                wrapperStyle={{ fontSize: 14 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default SalesGraph;
