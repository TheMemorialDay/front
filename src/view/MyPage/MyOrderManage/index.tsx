import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css';
import { useOrderReject, useOrderStore } from '../../../stores';
import { OrderRejectReason } from '../../../types';

// interface: 주문 내역 컴포넌트 Properties //
interface MyOrderDetailComponentProps {
    orderStatus: string;
    orderCode: string;
    orderImage: string;
    orderProduct: string;
    optionSelect: string;
    pickupTime: string;
    totalPrice: string;
}

function MyOrderDetailComponent({ orderCode, orderImage, orderProduct, optionSelect, pickupTime, totalPrice }: MyOrderDetailComponentProps) {

    const { orderMessage, orderStatus, setOrderMessage, setOrderStatus } = useOrderStore();
    const [modalOpen, setModalOpen] = useState(false);
    const modalBackground = useRef<HTMLDivElement | null>(null);
    const [secondReject, setSecondReject] = useState(false);
    const { orderReject, setOrderRejectStatus, cancelReason, setCancelReason } = useOrderReject();

    function ReadyAccept() {
        return (
            <div className='my-order-payed-status'>
                <div className='go-payed' onClick={() => { setOrderMessage('readyPay'); setOrderStatus('결제 대기중'); }}>승인</div>
                <div className='order-payed-cancle' onClick={() => { setOrderMessage('rejectOrderReason'); setModalOpen(true); }}>거부</div>
            </div>
        );
    };

    function ReadyPay() {
        return (
            <div className='my-order-status-reject'>
                <div className='go-payed' onClick={() => { setOrderMessage('rejectOrderReason'); setOrderStatus('결제 대기중'); setModalOpen(true); setSecondReject(true); }} >거부</div>
            </div>
        );
    };

    function FinishedPay() {
        return (
            <div className='my-order-status-pickup'>
                <div className='pickup-complete' onClick={() => { setOrderMessage('finishedOrder'); setOrderStatus('완료'); }}>픽업 완료</div>
            </div>
        );
    }

    function FinishedOrder() {
        return (
            <div className='my-order-status-finished'>
                <div className='order-finished'>완료</div>
            </div>
        );
    };

    function RejectOrder() {
        return (
            <div className='my-order-status-finished'>
                <div className='order-finished'>주문거부</div>
            </div>
        );
    }

    function RejectOrderReason() {

        const [inputReason, setInputReason] = useState<string>('');

        // event handler: 라디오 버튼 클릭 핸들러 // 
        const handleClickRadioButton = (reason: OrderRejectReason) => {
            if (reason !== '기타') {
                setOrderRejectStatus({ orderReject: reason });
            }
        }
        // Textarea 입력 핸들러
        const handleTextareaChange = (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target
            setInputReason(value); // 입력 값은 즉시 업데이트
        };

        // component: 모달창 //
        return (
            <>
                {
                    !secondReject ?
                        <div className='my-order-payed-status'>
                            <div className='go-payed' onClick={() => { setOrderMessage('readyPay'); setOrderStatus('결제 대기중'); }}>승인</div>
                            <div className='order-payed-cancle' onClick={() => { setOrderMessage('rejectOrderReason'); setModalOpen(true); }}>거부</div>
                        </div> :
                        <div className='my-order-status-reject'>
                            <div className='go-payed' onClick={() => { setOrderMessage('rejectOrderReason'); setOrderStatus('결제 대기중'); setModalOpen(true); setSecondReject(true); }} >거부</div>
                        </div>

                }
                {
                    modalOpen &&
                    <div className='modal-container' ref={modalBackground} onClick={e => {
                        if (e.target === modalBackground.current) {
                            setModalOpen(false);
                        }
                    }}>
                        <div className='modal-content' style={orderReject !== '기타' ? { height: 270 } : {}}>
                            <div className='review-component'>
                                <p className='review-title'>거부 사유</p>
                                <p className='review-cancel' onClick={() => setModalOpen(false)}>X</p>
                            </div>
                            <div className='order-reject-list'>
                                <div className='first-reject-button'>
                                    <div>
                                        <input
                                            type='radio'
                                            id='radio'
                                            checked={orderReject === '재료가 소진되었습니다.'}
                                            onClick={() => handleClickRadioButton('재료가 소진되었습니다.')} />
                                        <label htmlFor='radio'>재료가 소진되었습니다.</label>
                                    </div>
                                    <div>
                                        <input
                                            type='radio'
                                            id='radio1'
                                            checked={orderReject === '해당 시간에 예약이 가득 찼습니다.'}
                                            onClick={() => handleClickRadioButton('해당 시간에 예약이 가득 찼습니다.')} />
                                        <label htmlFor='radio1'>해당 시간 예약이 가득찼습니다.</label>
                                    </div>
                                </div>
                                <div className='second-reject-button'>
                                    <div>
                                        <input
                                            type='radio'
                                            id='radio2'
                                            checked={orderReject === '운영 시간이 변경되었습니다.'}
                                            onClick={() => handleClickRadioButton('운영 시간이 변경되었습니다.')} />
                                        <label htmlFor='radio2'>운영 시간이 변경되었습니다.</label>
                                    </div>
                                    <div className='another'>
                                        <input
                                            type='radio'
                                            checked={orderReject === '기타' || typeof orderReject === 'string' && orderReject !== '재료가 소진되었습니다.' && orderReject !== '해당 시간에 예약이 가득 찼습니다.' && orderReject !== '운영 시간이 변경되었습니다.'}
                                            onChange={() => setOrderRejectStatus({ orderReject: '기타' })}
                                        />
                                        <label>기타</label>
                                    </div>
                                </div>
                            </div>
                            {orderReject === '기타' ?
                                < input className='review-content' value={inputReason}
                                    onChange={handleTextareaChange} maxLength={60}
                                    placeholder="기타 사유를 입력해주세요." /> : ''
                            }
                            <div className='review-bottom'>
                                <div className='button disable' onClick={() => setModalOpen(false)}>취소</div>
                                <div className='button' onClick={() => { setOrderStatus('주문 거부'); setOrderMessage('rejectOrder'); setModalOpen(false); setCancelReason(inputReason); }}>거부</div>
                            </div>
                        </div>
                    </div >
                }
            </>
        );
    };


    // component: 주문내역 컴포넌트 반환 //
    return (
        <div className='order-list-component'>
            <div className='my-order-order'>
                <div className='order-box-top'>
                    <div>
                        {
                            orderStatus === '승인 대기중' ? '승인 대기중' :
                                orderStatus === '결제 대기중' ? '결제 대기중' :
                                    orderStatus === '결제 완료' ? '결제 완료' :
                                        orderStatus === '리뷰작성 완료' ? '완료' :
                                            orderStatus === '주문 취소' ? '주문 취소' :
                                                orderStatus === '완료' ? '완료' :
                                                    orderStatus === '주문 거부' ? '주문 거부' : ''
                        }
                    </div>
                    <div>주문 코드 - {orderCode}</div>
                </div>
                <hr />
                <div className='order-box-bottom'>
                    <div className="order-image">
                        <div className='order-image-list' style={{ backgroundImage: `url(${orderImage})` }}></div>
                    </div>
                    <div className="order-details">
                        <p className="order-product">{orderProduct}</p>
                        <p className="order-option">{optionSelect}</p>
                        <p className="order-plan">픽업일시 {pickupTime}</p>
                    </div>
                    <div className="order-value">금액 : {totalPrice}원</div>
                </div>
            </div>
            {
                orderMessage === 'readyAccept' ? <ReadyAccept /> :
                    orderMessage === 'readyPay' ? <ReadyPay /> :
                        orderMessage === 'finishedPay' ? <FinishedPay /> :
                            orderMessage === 'finishedOrder' ? <FinishedOrder /> :
                                orderMessage === 'rejectOrderReason' ? <RejectOrderReason /> :
                                    orderMessage === 'rejectOrder' ? <RejectOrder /> : ''
            }
        </div >
    );
};

export default function MyOrderManage() {
    return (
        <div className='order-history'>
            <div className='order-history-h2'>주문 관리</div>
            <div className='order-day'>2024. 11. 01</div>
            <div className='my-order-list'>
                <MyOrderDetailComponent orderStatus='승인' orderCode='20241021000001' orderImage='/picture12.png' orderProduct='딸기 케이크' optionSelect='2호, 빨강, 요청사항: 이쁘게 해주세요' pickupTime='2024. 11. 10' totalPrice='35000' />

            </div>
            <div></div>
        </div>
    )
}
