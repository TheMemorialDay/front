import React, { useEffect, useRef, useState } from 'react'
import './style.css';
import { SalesDateSelectProps } from '../../types';

// component: 년도 선택 컴포넌트 //
export default function YearSelect() {

	// state: Select box 요소 참조 상태 //+
	const selectBoxRef = useRef<HTMLDivElement|null>(null);

	// state: 년도 셀렉터 오픈 상태 //
    const [yearSelectorOpen, setYearSelectorOpen] = useState<boolean>(false);

	// state: 년도 선택 상태 //
	const [yearSelected, setYearSelected] = useState<SalesDateSelectProps | null>(null);

	// state: 선택 가능한 년도 리스트 상태 //
	const [yearList, setYearList] = useState<SalesDateSelectProps[]>([]);

	// event handler: 년도 셀렉터 상태 토글 //
    const onYearSelectorToggleHandler = () => {
        setYearSelectorOpen(!yearSelectorOpen);
    };

	// event handler: 년도 선택 //
	const onYearSelectButtonHandler = (year: SalesDateSelectProps) => {
		setYearSelected(year);
		if (!year) setYearSelected(null);
		setYearSelectorOpen(false);
	};

	// effect: 외부 클릭 시 셀렉터 닫히기 //
	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			if (selectBoxRef.current && !selectBoxRef.current.contains(event.target as Node)) {
				setYearSelectorOpen(false);
			}
		};
		window.addEventListener('mousedown', handleClick);
		return () => window.removeEventListener('mousedown', handleClick);	
	}, []);

	// render: 년도 선택 컴포넌트 렌더링 //
	return (
		<div ref={selectBoxRef} className='year-select-box'>
			{yearSelectorOpen ?
				<div className='year-input-box open' onClick={onYearSelectorToggleHandler}>
					<div className='selected-item'>년도 선택</div>
					<div className='arrow-up-button'></div>
					<div className='selector-box year'>
						{/* {yearList.map((year, index) => 
							<div className='selector-option' onClick={() => onYearSelectButtonHandler(year)} key={index}>{year.year}</div>
						)} */}
						<div className='selector-option'>2024</div>
						<div className='selector-option'>2025</div>
						<div className='selector-option'>2026</div>
						<div className='selector-option'>2027</div>
					</div>
				</div> :
				<div className='year-input-box close' onClick={onYearSelectorToggleHandler}>
					<div className='selected-item'>년도 선택</div>
					<div className='arrow-down-button'></div>
				</div>
			}
			<div className='year-text'>년</div>
		</div>
	)
}
