import React, { KeyboardEventHandler, useRef, useState } from 'react'
import './style.css';
import { FaRegStar, FaStar } from 'react-icons/fa';
import styled from "styled-components";
import { useOrderReject, useOrderStore } from '../../../stores';

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

// component: 주문 내역 컴포넌트 //
function MyOrderDetailComponent({ orderCode, orderImage, orderProduct, optionSelect, pickupTime, totalPrice }: MyOrderDetailComponentProps) {

    const { orderMessage, orderStatus, setOrderMessage, setOrderStatus } = useOrderStore();
    const { orderReject, setOrderRejectStatus, cancelReason, setCancelReason } = useOrderReject();


    function ReadyAccept() {
        return (
            <div className='my-order-status'>
                <div className='order-cancle' onClick={() => { setOrderMessage('cancelOrder'); setOrderStatus('주문 취소'); }}>주문 취소</div>
            </div>
        );
    };

    function ReadyPay() {
        return (
            <div className='my-order-payed-status'>
                <div className='go-payed' onClick={() => { setOrderMessage('finishedPay'); setOrderStatus('결제 완료'); }}>결제</div>
                <div className='order-payed-cancle' onClick={() => { setOrderMessage('cancelOrder'); setOrderStatus('주문 취소'); }}>주문 취소</div>
            </div>
        );
    };

    function FinishedPay() {
        return (
            <div className='my-order-status'>
                <div className='order-cancle' onClick={() => { setOrderMessage('cancelOrder'); setOrderStatus('주문 취소'); }}>환불 요청</div>
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

    // component: 거부 사유 모달창 //
    function OrderReject() {
        const [modalOpen, setModalOpen] = useState(false);
        const modalBackground = useRef<HTMLDivElement | null>(null);

        return (
            <>
                <div className='my-order-status' onClick={() => setModalOpen(true)}>
                    <div className='order-finished'>사유 보기</div>
                </div>
                {
                    modalOpen &&
                    <div className='modal-container' ref={modalBackground} onClick={e => {
                        if (e.target === modalBackground.current) {
                            setModalOpen(false);
                        }
                    }}>
                        <div className='modal-reject-content'>
                            <div className='order-reject-component'>
                                <p className='review-title'>주문취소 사유</p>
                                <p className='review-cancel' onClick={() => setModalOpen(false)}>X</p>
                            </div>
                            {
                                cancelReason === '' ?
                                    <div className='reject-reason'>{orderReject} 🤣</div> : <div className='reject-reason'>{cancelReason} 🤣</div>
                            }
                        </div>
                    </div >
                }
            </>
        );
    }

    // component: 리뷰 작성 모달창 //
    function WriteReview() {
        const [modalOpen, setModalOpen] = useState(false);
        const modalBackground = useRef<HTMLDivElement | null>(null);
        const fileInputRef = useRef<HTMLInputElement | null>(null);
        const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

        const openFileDialog = () => {
            fileInputRef.current?.click();
        };

        // 파일 바꾸기 //
        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files) {
                const newFiles = Array.from(event.target.files);
                const allFiles = [...selectedFiles, ...newFiles].slice(0, 4); // 최대 4장까지 유지
                setSelectedFiles(allFiles);
            }
        };

        // 이미지 초기화 //
        const onResetImagesHandler = () => {
            setSelectedFiles([]);
        }

        // component: 별 표기 //

        const StarSection = styled('div')`
        .star {
            color : rgba(250, 237, 30, 1);
            font-size : 22px;
            cursor:pointer;
        }`;

        const StarRating = () => {
            const [starScore, setStarScore] = useState<number>(0);

            const ratingStarHandler = (): any[] => {
                let result: any[] = [];
                for (let i: number = 0; i < 5; i++) {
                    result.push(
                        <span key={i + 1} onClick={() => setStarScore(i + 1)}>
                            {
                                i + 1 <= starScore ?
                                    <FaStar className="star" />
                                    :
                                    <FaRegStar className="star" />
                            }
                        </span>);
                }
                return result;
            }

            return (
                <StarSection>
                    {ratingStarHandler()}
                </StarSection>
            )
        }
        return (
            <>
                <div className='write-review' onClick={() => setModalOpen(true)}>리뷰 쓰기</div>
                {
                    modalOpen &&
                    <div className='modal-container' ref={modalBackground} onClick={e => {
                        if (e.target === modalBackground.current) {
                            setModalOpen(false);
                        }
                    }}>
                        <div className='modal-content'>
                            <div className='review-component'>
                                <p className='review-title'>리뷰 작성</p>
                                <p className='review-cancel' onClick={() => setModalOpen(false)}>X</p>
                            </div>
                            <div className='review-photo-list'>
                                <div className='review-photo'>
                                    <div className='add-button' onClick={() => fileInputRef.current?.click()}>
                                        <div className='circle'>+</div>
                                        <div className='add-text'>사진 추가</div>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        style={{ display: 'none' }} // 사용자가 보지 못하게 숨겨진 상태
                                        onChange={handleFileChange} // 파일 선택 시 핸들러 호출
                                    />
                                </div>
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className='review-photo'
                                        style={{
                                            backgroundImage: `url(${URL.createObjectURL(file)})`, // 선택된 파일의 미리보기 이미지 생성
                                            backgroundSize: "cover"
                                        }} />
                                ))}
                            </div>
                            <div className='review-inform'>
                                <p>가게명 : 부산케이크</p>
                                <p>상품 : 부드러운 초코 케이크</p>
                                <p className='review-star'>별점 : &nbsp; <StarRating /></p>
                            </div>
                            <textarea className='review-content' placeholder='리뷰를 작성해주세요. 최대(100자)' maxLength={100} />
                            <div className='review-bottom'>
                                <div className='button disable' onClick={() => setModalOpen(false)}>취소</div>
                                <div className='button' onClick={() => setOrderStatus('리뷰작성 완료')}>등록</div>
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
                                                orderStatus === '완료' ? <WriteReview /> :
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
                                orderMessage === 'rejectOrder' ? <OrderReject /> : ''

            }
        </div >
    );
};

export default function MyOrderDetail() {

    // render: 주문 내역 컴포넌트 렌더링 //
    return (
        <div className='order-history'>
            <div className='order-history-h2'>주문 내역</div>
            <div className='order-day'>2024. 11. 01</div>
            <div className='my-order-list'>
                <MyOrderDetailComponent orderStatus='승인' orderCode='20241021000001' orderImage='/picture12.png' orderProduct='딸기 케이크' optionSelect='2호, 빨강, 요청사항: 이쁘게 해주세요' pickupTime='2024. 11. 10' totalPrice='35000' />

            </div>
            <div></div>
        </div>
    )
}
