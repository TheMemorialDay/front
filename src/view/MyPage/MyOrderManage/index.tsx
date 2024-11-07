import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css';
import { useOrderReject, useSignInUserStore } from '../../../stores';
import { OrderDetailsProps } from '../../../types';
import { useCookies } from 'react-cookie';
import GetOrderDetailListResponseDto from '../../../apis/dto/response/get-order-detail-list.response.dto';
import { ResponseDto } from '../../../apis/dto/response';
import { ACCESS_TOKEN } from '../../../constants';
import { getOrderDetailRequest, getOrderManageRequest, patchOrderStatusRequest } from '../../../apis';
import PatchOrderStatusReqeustDto from '../../../apis/dto/request/order/patch-order-status-request.dto';

// interface: 주문 내역 컴포넌트 Properties //
interface OrderDetailProps {
    orderdetail: OrderDetailsProps,
    getOrderDetailList: () => void;
};

function MyOrderDetailComponent({ orderdetail, getOrderDetailList }: OrderDetailProps) {

    type OrderStatus = '승인 대기중' | '결제 대기중' | '결제 완료' | '리뷰 쓰기' | '완료' | '주문 취소' | '주문 거부' | '픽업 완료' | '리뷰작성 완료';
    type CancelCode = '재료가 소진되었습니다.' | '해당 시간에 예약이 가득 찼습니다.' | '운영 시간이 변경되었습니다.' | '기타' | '';

    const { options } = orderdetail;

    // state: order 상태 관리 //
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(orderdetail.orderStatus as OrderStatus);

    const [modalOpen, setModalOpen] = useState(false);
    const modalBackground = useRef<HTMLDivElement | null>(null);
    const [secondReject, setSecondReject] = useState(false);
    const [cancelCode, setCancelCode] = useState<CancelCode>('');
    const [cancelReason, setCancelReason] = useState<string>('');

    const [cookies] = useCookies();

    const { signInUser } = useSignInUserStore();
    const [userId, setUserId] = useState<string>('');

    // function: 상태 변경 //
    const onUpdateOrderStatus = () => {

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            console.log('토큰 오류');
            return;
        }

        if (!cancelCode) {
            const requestBody: PatchOrderStatusReqeustDto = {
                orderCode: orderdetail.orderCode,
                orderStatus: orderStatus
            };
            console.log(orderStatus);
            patchOrderStatusRequest(requestBody, orderdetail.orderCode, accessToken).then(patchOrderStatusResponse).then(getOrderDetailList);
        }

        if (cancelCode && !cancelReason) {
            const requestBody: PatchOrderStatusReqeustDto = {
                orderCode: orderdetail.orderCode,
                orderStatus: orderStatus,
                cancelCode: cancelCode,
            };
            console.log(orderStatus);
            patchOrderStatusRequest(requestBody, orderdetail.orderCode, accessToken).then(patchOrderStatusResponse).then(getOrderDetailList);
        }

        if (cancelCode && cancelReason) {
            const requestBody: PatchOrderStatusReqeustDto = {
                orderCode: orderdetail.orderCode,
                orderStatus: orderStatus,
                cancelCode: cancelCode,
                cancelReason: cancelReason
            };
            console.log(orderStatus);
            patchOrderStatusRequest(requestBody, orderdetail.orderCode, accessToken).then(patchOrderStatusResponse).then(getOrderDetailList);
        }

    }

    // function: patch orderstatus response 처리 함수 //
    const patchOrderStatusResponse = (responseBody: ResponseDto | null) => {

        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                        responseBody.code === 'NS' ? '존재한 상점이 없습니다' :
                            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    }

    function ReadyPay() {
        return (
            <div className='my-order-status-reject'>
                <div className='go-payed' onClick={() => { setOrderStatus('결제 대기중'); setModalOpen(true); setSecondReject(true); }} >거부</div>
            </div>
        );
    };

    function FinishedPay() {
        return (
            <div className='my-order-status-pickup'>
                <div className='pickup-complete' onClick={() => { setOrderStatus('완료'); }}>픽업 완료</div>
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
        const handleClickRadioButton = (reason: CancelCode) => {
            if (reason !== '기타') {
                setCancelCode(reason);
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
                            <div className='go-payed' onClick={() => { setOrderStatus('결제 대기중'); }}>승인</div>
                            <div className='order-payed-cancle' onClick={() => { setModalOpen(true); }}>거부</div>
                        </div> :
                        <div className='my-order-status-reject'>
                            <div className='go-payed' onClick={() => { setOrderStatus('결제 대기중'); setModalOpen(true); setSecondReject(true); }} >거부</div>
                        </div>

                }
                {
                    modalOpen &&
                    <div className='modal-container' ref={modalBackground} onClick={e => {
                        if (e.target === modalBackground.current) {
                            setModalOpen(false);
                        }
                    }}>
                        <div className='modal-content' style={cancelCode !== '기타' ? { height: 270 } : {}}>
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
                                            checked={cancelCode === '재료가 소진되었습니다.'}
                                            onClick={() => handleClickRadioButton('재료가 소진되었습니다.')} />
                                        <label htmlFor='radio'>재료가 소진되었습니다.</label>
                                    </div>
                                    <div>
                                        <input
                                            type='radio'
                                            id='radio1'
                                            checked={cancelCode === '해당 시간에 예약이 가득 찼습니다.'}
                                            onClick={() => handleClickRadioButton('해당 시간에 예약이 가득 찼습니다.')} />
                                        <label htmlFor='radio1'>해당 시간 예약이 가득찼습니다.</label>
                                    </div>
                                </div>
                                <div className='second-reject-button'>
                                    <div>
                                        <input
                                            type='radio'
                                            id='radio2'
                                            checked={cancelCode === '운영 시간이 변경되었습니다.'}
                                            onClick={() => handleClickRadioButton('운영 시간이 변경되었습니다.')} />
                                        <label htmlFor='radio2'>운영 시간이 변경되었습니다.</label>
                                    </div>
                                    <div className='another'>
                                        <input
                                            type='radio'
                                            checked={cancelCode === '기타' || typeof cancelCode === 'string' && cancelCode !== '재료가 소진되었습니다.' && cancelCode !== '해당 시간에 예약이 가득 찼습니다.' && cancelCode !== '운영 시간이 변경되었습니다.'}
                                            onChange={() => setCancelCode('기타')}
                                        />
                                        <label>기타</label>
                                    </div>
                                </div>
                            </div>
                            {cancelCode === '기타' ?
                                < input className='review-content' value={inputReason}
                                    onChange={handleTextareaChange} maxLength={60}
                                    placeholder="기타 사유를 입력해주세요." /> : ''
                            }
                            <div className='review-bottom'>
                                <div className='button disable' onClick={() => { setOrderStatus('승인 대기중'); setModalOpen(false); }}>취소</div>
                                <div className='button' onClick={() => { setOrderStatus('주문 거부'); setModalOpen(false); setCancelReason(inputReason); }}>거부</div>
                            </div>
                        </div>
                    </div >
                }
            </>
        );
    };

    // effect: 유저 정보 불러오기 함수 //
    useEffect(() => {
        if (signInUser) {
            setUserId(signInUser.userId);
        }

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            console.log('접근 권한이 없습니다.');
            return;
        }
        getOrderDetailList();
    }, [signInUser]);

    useEffect(() => {
        onUpdateOrderStatus();
    }, [orderStatus])


    // component: 주문내역 컴포넌트 반환 //
    return (
        <div className='order-list-component'>
            <div className='my-order-order'>
                <div className='order-box-top'>
                    <div>
                        {
                            orderStatus === '승인 대기중' ? '승인 대기중' :
                                orderStatus === '결제 대기중' ? '결제 대기중' :
                                    orderStatus === '결제 완료' ? '결제 완료 - 픽업 대기중' :
                                        orderStatus === '리뷰작성 완료' ? '완료' :
                                            orderStatus === '주문 취소' ? '주문 취소' :
                                                orderStatus === '완료' ? '완료' : ''
                        }
                    </div>
                    <div>주문 코드 - {orderdetail.orderCode}</div>
                </div>
                <hr />
                <div className='order-box-bottom'>
                    <div className="order-image">
                        <div className='order-image-list' style={{ backgroundImage: `url(${orderdetail.productImageUrl})` }}></div>
                    </div>
                    <div className="order-details">
                        <p className="order-product">{(orderdetail.storeName).split(",")[1]} - {orderdetail.productName}</p>
                        <div className="order-productCategory-productContents">
                            <div>
                                {options.map((option, index) => (
                                    <span key={index} className="order-option">{orderdetail.productContents ? orderdetail.productContents : '없음'}{index < options.length ? ', ' : ',   '} </span>     // css 조금 수정할 예정입니다.
                                ))}
                            </div>
                            <div>
                                요청사항: {orderdetail.productContents}
                            </div>
                        </div>
                        <p className="order-plan">픽업일시 {orderdetail.pickupTime}</p>
                    </div>
                    <div className="order-value">금액 : {orderdetail.totalPrice}원</div>
                </div>
            </div>
            {
                orderStatus === '승인 대기중' ? <RejectOrderReason /> :
                    orderStatus === '결제 대기중' ? <ReadyPay /> :
                        orderStatus === '결제 완료' ? <FinishedPay /> :
                            orderStatus === '픽업 완료' ? <FinishedOrder /> : ''
            }
        </div >
    );
};

export default function MyOrderManage() {

    const [userId, setUserId] = useState<string>('');
    const { signInUser } = useSignInUserStore();
    // state: 주문 정보 상태 //
    const [orderDetailList, setOrderDetailList] = useState<OrderDetailsProps[]>([]);

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // function: get Order Detail Response 처리 함수 //
    const getOrderDetailResponse = (responseBody: GetOrderDetailListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '잘못된 접근입니다.' :
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        const { orders } = responseBody as GetOrderDetailListResponseDto;
        setOrderDetailList(orders);

    }

    // function: order detail list 불러오기 함수 //
    const getOrderDetailList = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken || !signInUser || !signInUser.storeNumber) {
            console.log('접근 권한이 없습니다.');
            return;
        }
        getOrderManageRequest(signInUser.storeNumber, accessToken).then(getOrderDetailResponse);
    }

    // effect: 유저 정보 불러오기 함수 //
    useEffect(() => {
        if (signInUser) {
            setUserId(signInUser.userId);
        }

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            console.log('접근 권한이 없습니다.');
            return;
        }
        getOrderDetailList();
    }, [signInUser]);


    return (
        <div className='order-history'>
            <div className='order-history-h2'>주문 관리</div>
            <div className='order-day'>2024. 11. 01</div>
            <div className='my-order-list'>
                {
                    orderDetailList.map((orderdetail) => <MyOrderDetailComponent key={orderdetail.orderCode} orderdetail={orderdetail} getOrderDetailList={getOrderDetailList} />)
                }
            </div>
            <div></div>
        </div>
    )
}
