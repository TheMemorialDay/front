import React, { useState } from 'react'
import './style.css';
import { YearSelectProps } from '../../types';

// interface: 년도 선택 //
interface SelectYearProps {
	selectYear: YearSelectProps;
}

// component: 년도 선택 컴포넌트 //
export default function YearSelect() {

	// state: 년도 셀렉터 상태 //
    const [yearSelector, setYearSelector] = useState<boolean>(false);

	// event handler: 년도 셀렉터 상태 토글 //
    const onYearSelectorToggleHandler = () => {
        setYearSelector(!yearSelector);
    };

	// render: 년도 선택 컴포넌트 렌더링 //
	return (
		<div className='year-select-box'>
			{yearSelector ?
				<div className='year-input-box open' onClick={onYearSelectorToggleHandler}>
					<div className='selected-item'>년도 선택</div>
					<div className='arrow-up-button'></div>
					<div className='selector-box year'>
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
