import React from 'react';
import './style.css';

interface NotMemberProps {
    onClose: () => void;
    onConfirm: () => void;
}

export default function NotMember({ onClose, onConfirm }: NotMemberProps) {
    return (
        <div id="not-member-container">
            <h1 className="not-member-title">회원에게만 제공되는 기능입니다.</h1>
            <p className="not-member-message">로그인하시겠습니까?</p>
            <div className="not-member-buttons">
                <button className="confirm-button" onClick={onConfirm}>
                    확인
                </button>
                <button className="cancel-button" onClick={onClose}>
                    취소
                </button>
            </div>
        </div>
    );
}


// 쿠키 로직 작성 완료 하시면 비회원 접속 불가 모달로 사용하시면 됩나다!