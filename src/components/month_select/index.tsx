import React, { useEffect, useRef, useState } from 'react'
import './style.css';
import { MonthSelectProps } from '../../types';

// interface: 월 선택 //
interface SelectMonthProps {
	month: MonthSelectProps;
}

// component: 월 선택 컴포넌트 //
export default function MonthSelect() {

	// state: 월 셀렉터 상태 //
	const [monthSelector, setMonthSelector] = useState<boolean>(false);

	// state: 월 선택 셀렉터 참조 상태 //
	const selectBoxRef = useRef<HTMLDivElement|null>(null);

	// event handler: 년도 셀렉터 상태 토글 //
	const onmonthSelectorToggleHandler = () => {
		setMonthSelector(!monthSelector);
	};

	// effect: 외부 클릭 시 셀렉터 닫히기 //
	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			if (selectBoxRef.current && !selectBoxRef.current.contains(event.target as Node)) {
				setMonthSelector(false);
			}
		};
		window.addEventListener('mousedown', handleClick);
		return () => window.removeEventListener('mousedown', handleClick);
	}, []);

	// render: 월 선택 컴포넌트 렌더링 //
	return (
		<div ref={selectBoxRef} className='month-select-box'>
			{monthSelector ?
				<div className='month-input-box open' onClick={onmonthSelectorToggleHandler}>
					<div className='selected-item'>월 선택</div>
					<div className='arrow-up-button'></div>
					<div className='selector-box month'>
						<div className='selector-option'>12</div>
						<div className='selector-option'>11</div>
						<div className='selector-option'>10</div>
						<div className='selector-option'>9</div>
						<div className='selector-option'>8</div>
						<div className='selector-option'>7</div>
						<div className='selector-option'>6</div>
						<div className='selector-option'>5</div>
						<div className='selector-option'>4</div>
						<div className='selector-option'>3</div>
						<div className='selector-option'>2</div>
						<div className='selector-option'>1</div>
					</div>
				</div> :
				<div className='month-input-box close' onClick={onmonthSelectorToggleHandler}>
					<div className='selected-item'>월 선택</div>
					<div className='arrow-down-button'></div>
				</div>
			}
			<div className='month-text'>월</div>
		</div>
	)
}
