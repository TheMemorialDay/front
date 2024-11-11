import React, { useState, useEffect, useRef } from 'react';
import './style.css';

interface YearSelectProps {
    setYearSelected: (year: string | null) => void;
    yearSelected: string | null; // 현재 선택된 년도를 prop으로 전달
}

export default function YearSelect({ setYearSelected, yearSelected }: YearSelectProps) {
    const [yearSelectorOpen, setYearSelectorOpen] = useState<boolean>(false);
    const selectBoxRef = useRef<HTMLDivElement | null>(null);

    const onYearSelectorToggleHandler = () => {
        setYearSelectorOpen(!yearSelectorOpen);
    };

    const onYearSelectButtonHandler = (year: string) => {
        setYearSelected(year); // 선택된 년도 설정
        setYearSelectorOpen(false); // 셀렉터 닫기
    };

    const years = ['2024', '2025', '2026', '2027']; // 년도 목록

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (selectBoxRef.current && !selectBoxRef.current.contains(event.target as Node)) {
                setYearSelectorOpen(false);
            }
        };
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div ref={selectBoxRef} className='year-select-box'>
            <div className='year-input-box' onClick={onYearSelectorToggleHandler}>
                <div className='selected-item'>
                    {yearSelected ? yearSelected : '년도 선택'} {/* 선택된 년도 표시 */}
                </div>
                <div className='arrow-button'>
                    {yearSelectorOpen ? '▲' : '▼'}
                </div>
            </div>
            {yearSelectorOpen && (
                <div className='selector-box'>
                    {years.map((year, index) => (
                        <div key={index} className='selector-option' onClick={() => onYearSelectButtonHandler(year)}>
                            {year}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
