import React from 'react';
import './Footer.css';

export default function Footer() {
    return (
        <div id='footer'>
            <div className='footer-in-box'>
                <div className='footer-title-logo'>
                    <div style={{ fontWeight: '600' }}>The Memorial Day</div>
                    <div style={{ fontSize: '12px' }}> &copy; 2024 B Team. All rights reserved</div>
                </div>
                <div className='footer-content'>
                    <div>이메일: TheMemorialDay@email.com</div>
                    <div>대표자: 안찬숙, 송태휘, 정호정, 김도연</div>
                    <div>최종 업데이트: 2024.11.22</div>
                </div>
            </div>
        </div>
    );
}
