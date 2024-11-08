import React, { useState, useEffect, useRef } from 'react';
import './style.css';

interface MonthSelectProps {
    setMonthSelected: (month: string | null) => void;
    monthSelected: string | null; // 현재 선택된 월을 prop으로 전달
}

export default function MonthSelect({ setMonthSelected, monthSelected }: MonthSelectProps) {
    const [monthSelectorOpen, setMonthSelectorOpen] = useState<boolean>(false);
    const selectBoxRef = useRef<HTMLDivElement | null>(null);

    const onMonthSelectorToggleHandler = () => {
        setMonthSelectorOpen(!monthSelectorOpen);
    };

    const onMonthSelectButtonHandler = (month: string) => {
        setMonthSelected(month);
        setMonthSelectorOpen(false);
    };

    const months = [
        '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'
    ]; // 월 목록

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (selectBoxRef.current && !selectBoxRef.current.contains(event.target as Node)) {
                setMonthSelectorOpen(false);
            }
        };
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div ref={selectBoxRef} className='month-select-box'>
            <div className='month-input-box' onClick={onMonthSelectorToggleHandler}>
                <div className='selected-item'>
                    {monthSelected ? `${monthSelected}월` : '월 선택'} {/* 선택된 월 표시 */}
                </div>
                <div className='arrow-button'>
                    {monthSelectorOpen ? '▲' : '▼'}
                </div>
            </div>
            {monthSelectorOpen && (
                <div className='selector-box'>
                    {months.map((month, index) => (
                        <div key={index} className='selector-option' onClick={() => onMonthSelectButtonHandler(month)}>
                            {month}월
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
