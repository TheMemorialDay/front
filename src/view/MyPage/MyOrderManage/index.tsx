import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css';
import { useOrderReject, useSignInUserStore } from '../../../stores';
import { NewOrderDetailsProps, OrderDetailsProps } from '../../../types';
import { useCookies } from 'react-cookie';
import GetOrderDetailListResponseDto from '../../../apis/dto/response/get-order-detail-list.response.dto';
import { ResponseDto } from '../../../apis/dto/response';
import { ACCESS_TOKEN } from '../../../constants';
import { getOrderDetailRequest, getOrderManageRequest, patchOrderStatusRequest, postSendPaymentMsgRequest } from '../../../apis';
import PatchOrderStatusReqeustDto from '../../../apis/dto/request/order/patch-order-status-request.dto';
import { Autocomplete, TextField } from '@mui/material';
import NewGetOrderManageList from '../../../apis/dto/response/new-get-order-manage.response.dto';
import { PostSendPaymentMsgRequestDto } from '../../../apis/dto/request/order';

// interface: 주문 내역 컴포넌트 Properties //
interface OrderDetailProps {
    orderdetail: NewOrderDetailsProps,
    getOrderDetailList: () => void;
};

function MyOrderDetailComponent({ orderdetail, getOrderDetailList }: OrderDetailProps) {

    type OrderStatus = '승인 대기중' | '결제 대기중' | '결제 완료' | '리뷰 쓰기' | '완료' | '주문 취소' | '주문 거부' | '픽업 완료';
    type CancelCode = '재료가 소진되었습니다.' | '해당 시간에 예약이 가득 찼습니다.' | '운영 시간이 변경되었습니다.' | '기타' | '';

    const { options } = orderdetail;

    // state: order 상태 관리 //
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(orderdetail.orderStatus as OrderStatus);

    const [modalOpen, setModalOpen] = useState(false);
    const modalBackground = useRef<HTMLDivElement | null>(null);
    const [secondReject, setSecondReject] = useState(false);
    const [cancelCode, setCancelCode] = useState<CancelCode>('재료가 소진되었습니다.');
    const [cancelReason, setCancelReason] = useState<string>('');

    const [cookies] = useCookies();

    const { signInUser } = useSignInUserStore();
    const [userId, setUserId] = useState<string>('');

    // state: order submit time //
    const [orderSubmitTime, setOrderSubmitTime] = useState<string>('');

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

    // function: 숫자 쉼표 찍어주는 함수 //
    function formatNumberWithCommas(number: number): string {
        return new Intl.NumberFormat('en-US').format(number);
    }

    // function: 전화번호 - 넣어주는 함수 //
    function formatPhoneNumber(phone: string): string {
        return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }

    function FinishedPay() {
        return (
            <div className='my-order-status-pickup'>
                <div className='pickup-complete' onClick={() => { console.log('작동 오류'); onPickUpFinishOrderStatus(); }}>픽업 완료</div>
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

    // function: 주문 승인 및 거부 //
    function RejectOrderReason() {

        const [inputReason, setInputReason] = useState<string>('');

        // event handler: 라디오 버튼 클릭 핸들러 // 
        const handleClickRadioButton = (reason: CancelCode) => {
            if (reason !== '기타') {
                setCancelCode(reason);
            }
        }
        // event handler: Textarea 입력 핸들러 //
        const handleTextareaChange = (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target
            setInputReason(value); // 입력 값은 즉시 업데이트
        };

        // function: post send payment message response 처리 함수 //
        const postSendPaymentMsgResponse = (responseBody: null | ResponseDto) => {
            const message =
                !responseBody ? '서버에 문제가 있습니다.' :
                    responseBody.code === 'DBE' ? '서버에 문제가 있습니다. ' :
                        responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' : '';

            const isSuccessed = responseBody !== null && responseBody.code === 'SU';
            if (!isSuccessed) {
                alert(message);
                return;
            }
        }

        // Function: 주문 수락 클릭 핸들러 //
        const onAcccpetUpdateOrderStatus = () => {

            // 문자 메시지 전송
            const accessToken = cookies[ACCESS_TOKEN];
            if (signInUser && accessToken) {
                const requestBody1: PostSendPaymentMsgRequestDto = {
                    telNumber: orderdetail.telNumber,
                    name: orderdetail.name,
                    totalPrice: orderdetail.totalPrice,
                    storeName: orderdetail.storeName.split(",")[1],
                    productName: orderdetail.productName
                }
                postSendPaymentMsgRequest(requestBody1, accessToken).then(postSendPaymentMsgResponse);
            }
            setOrderStatus('결제 대기중');

            if (!accessToken) {
                console.log('토큰 오류');
                return;
            }
            console.log(orderStatus);

            const requestBody: PatchOrderStatusReqeustDto = {
                orderCode: orderdetail.orderCode,
                orderStatus: '결제 대기중'
            };
            console.log('작동');
            setSecondReject(true);
            patchOrderStatusRequest(requestBody, orderdetail.orderCode, accessToken).then(patchOrderStatusResponse).then(getOrderDetailList);
        }

        // Function: 주문 거부 클릭 핸들러 //
        const onRejectUpdateOrderStatus = () => {
            setOrderStatus('주문 거부');

            const accessToken = cookies[ACCESS_TOKEN];
            if (!accessToken) {
                console.log('토큰 오류');
                return;
            }

            if (cancelCode && !cancelReason) {
                const requestBody: PatchOrderStatusReqeustDto = {
                    orderCode: orderdetail.orderCode,
                    orderStatus: '주문 거부',
                    cancelCode: cancelCode,
                };
                patchOrderStatusRequest(requestBody, orderdetail.orderCode, accessToken).then(patchOrderStatusResponse).then(getOrderDetailList);
            }

            if (cancelCode && cancelReason) {
                const requestBody: PatchOrderStatusReqeustDto = {
                    orderCode: orderdetail.orderCode,
                    orderStatus: '주문 거부',
                    cancelCode: cancelCode,
                    cancelReason: inputReason
                };
                patchOrderStatusRequest(requestBody, orderdetail.orderCode, accessToken).then(patchOrderStatusResponse).then(getOrderDetailList);

            }
        }

        // component: 모달창 //
        return (
            <>
                {
                    !secondReject ?
                        <div className='my-order-payed-status'>
                            <div className='go-payed' onClick={onAcccpetUpdateOrderStatus}>승인</div>
                            <div className='order-payed-cancle' onClick={() => { console.log('거부 클릭됨'); setModalOpen(true); }}>거부</div>
                        </div > :
                        <div className='my-order-status-reject'>
                            <div className='go-payed' onClick={() => { setModalOpen(true); }} >거부</div>
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
                                <div className='button disable' onClick={() => { setModalOpen(false); }}>취소</div>
                                <div className='button' onClick={() => { onRejectUpdateOrderStatus(); setModalOpen(false); }}>거부</div>
                            </div>
                        </div>
                    </div >
                }
            </>
        );
    };

    // function: 주문 거부 //
    function RejectOrder() {

        const [inputReason, setInputReason] = useState<string>('');

        // event handler: 라디오 버튼 클릭 핸들러 // 
        const handleClickRadioButton = (reason: CancelCode) => {
            if (reason !== '기타') {
                setCancelCode(reason);
            }
        }
        // event handler: Textarea 입력 핸들러 //
        const handleTextareaChange = (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target
            setInputReason(value); // 입력 값은 즉시 업데이트
        };

        // Function: 주문 거부 클릭 핸들러 //
        const onRejectUpdateOrderStatus = () => {
            setOrderStatus('주문 거부');

            const accessToken = cookies[ACCESS_TOKEN];
            if (!accessToken) {
                console.log('토큰 오류');
                return;
            }

            if (cancelCode && !cancelReason) {
                const requestBody: PatchOrderStatusReqeustDto = {
                    orderCode: orderdetail.orderCode,
                    orderStatus: '주문 거부',
                    cancelCode: cancelCode,
                };
                patchOrderStatusRequest(requestBody, orderdetail.orderCode, accessToken).then(patchOrderStatusResponse).then(getOrderDetailList);
            }

            if (cancelCode && cancelReason) {
                const requestBody: PatchOrderStatusReqeustDto = {
                    orderCode: orderdetail.orderCode,
                    orderStatus: '주문 거부',
                    cancelCode: cancelCode,
                    cancelReason: inputReason
                };
                patchOrderStatusRequest(requestBody, orderdetail.orderCode, accessToken).then(patchOrderStatusResponse).then(getOrderDetailList);

            }
        }

        // component: 모달창 //
        return (
            <>
                <div className='my-order-status-reject' onClick={() => { setModalOpen(true); }}>
                    <div className='go-payed'>거부</div>
                </div>
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
                                <div className='button disable' onClick={() => { setModalOpen(false); }}>취소</div>
                                <div className='button' onClick={() => { onRejectUpdateOrderStatus(); setModalOpen(false); }}>거부</div>
                            </div>
                        </div>
                    </div >
                }
            </>
        );
    }

    // Function: 픽업완료 클릭 핸들러 //
    const onPickUpFinishOrderStatus = () => {
        setOrderStatus('픽업 완료');

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            console.log('토큰 오류');
            return;
        }

        const requestBody: PatchOrderStatusReqeustDto = {
            orderCode: orderdetail.orderCode,
            orderStatus: '픽업 완료',
        };
        patchOrderStatusRequest(requestBody, orderdetail.orderCode, accessToken).then(patchOrderStatusResponse).then(getOrderDetailList);

    }

    // component: 주문내역 컴포넌트 반환 //
    return (
        <>
            <div className='order-day'>{orderdetail.orderTime.split("T")[0]}</div>
            <div className='order-list-component'>
                <div className='my-order-order'>
                    <div className='order-box-top'>
                        <div >
                            {
                                orderStatus === '승인 대기중' ? '승인 대기중' :
                                    orderStatus === '결제 대기중' ? '결제 대기중' :
                                        orderStatus === '결제 완료' ? '결제 완료 - 픽업 대기중' :
                                            orderStatus === '주문 취소' ? '주문 취소' :
                                                orderStatus === '픽업 완료' ? '픽업 완료' :
                                                    orderStatus === '완료' ? '완료' :
                                                        orderStatus === '주문 거부' ? '거부된 주문' : ''
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
                                <div>옵션:
                                    {options.map((option, index) => (
                                        <span key={index} className="order-option">
                                            {option.productCategory ? option.productCategory : '없음'}
                                            {index < options.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </div>
                                <div>
                                    요청사항: {orderdetail.productContents ? orderdetail.productContents : '없음'}
                                </div>
                            </div>
                            <p className="order-plan">픽업일시: {orderdetail.pickupTime}</p>
                            {orderStatus === '완료' ? '' :
                                <div className='orderer-info'>
                                    <div>주문 고객: </div>
                                    <div>{orderdetail.name} </div>
                                    <div>{formatPhoneNumber(orderdetail.telNumber)}</div>
                                </div>
                            }
                        </div>
                        <div className="order-value">금액 : {formatNumberWithCommas(orderdetail.totalPrice)}원</div>

                    </div>

                </div>
                {
                    orderStatus === '승인 대기중' ? <RejectOrderReason /> :
                        orderStatus === '결제 대기중' ? <RejectOrder /> :
                            orderStatus === '결제 완료' ? <FinishedPay /> :
                                orderStatus === '픽업 완료' ? <FinishedOrder /> : ''
                }
            </div >
        </>
    );
};

export default function MyOrderManage() {

    // state: 원본 리스트 상태 //
    const originalList = useRef<NewOrderDetailsProps[]>([]);

    const [userId, setUserId] = useState<string>('');
    const { signInUser } = useSignInUserStore();
    // state: 주문 정보 상태 //
    const [orderDetailList, setOrderDetailList] = useState<NewOrderDetailsProps[]>([]);
    const [selectedYear, setSelectedYear] = useState<string | null>();
    const [selectedMonth, setSelectedMonth] = useState<string | null>();
    const [selectedStatus, setSelectedStatus] = useState<string | null>();
    const [selectedSort, setSelectedSort] = useState<string | null>();

    const yearProps = {
        options: ['2024', '2025', '2026']
    };

    const monthProps = {
        options: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
    };

    const statusProps = {
        options: ['승인 대기중', '결제 대기중', '결제 완료', '픽업 완료', '완료', '주문 취소', '주문 거부']
    };

    const sortProps = {
        options: ['빠른 주문일 순', '늦은 주문일 순', '가까운 픽업일 순', '먼 픽업일 순']
    };

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // Function: 픽업 완료 상태 업데이트 함수 //
    const updateCompletedPickups = async () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            console.log('토큰 오류');
            return;
        }

        // Function: 현재 시간 기준으로 픽업 완료 상태로 변경해야 할 주문들 필터링 //
        const currentTime = new Date();
        const ordersToUpdate = originalList.current.filter(order => {
            const pickupTime = new Date(order.pickupTime);
            return pickupTime <= currentTime && order.orderStatus !== '픽업 완료' && order.orderStatus !== '완료';
        });

        // Function: 서버에 PATCH 요청을 보내 orderStatus 업데이트 //
        for (const order of ordersToUpdate) {
            const requestBody: PatchOrderStatusReqeustDto = {
                orderCode: order.orderCode,
                orderStatus: '픽업 완료',
            };
            console.log('로딩 완료');

            try {
                await patchOrderStatusRequest(requestBody, order.orderCode, accessToken);
            } catch (error) {
                console.error('주문 상태 업데이트 오류:', error);
            }
        }
    };

    // function: get Order Detail Response 처리 함수 //
    const getOrderDetailResponse = (responseBody: NewGetOrderManageList | ResponseDto | null) => {
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
        const { orderManages } = responseBody as NewGetOrderManageList;
        setOrderDetailList(orderManages);
        originalList.current = orderManages;

    }

    // function: 사장님이 주문 승인 후 24시간 이내에 결제되지 않으면 자동으로 주문 취소되는 함수 //
    const check24hours = async () => {
        const date = new Date();
        const now = date.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

        return;
    }

    // function: order detail list 불러오기 함수                                                          가장 처음 주문 리스트 불러오는 함수 //
    const getOrderDetailList = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken || !signInUser || !signInUser.storeNumber) {
            console.log('접근 권한이 없습니다.');
            console.log(signInUser);
            return;
        }
        getOrderManageRequest(signInUser.storeNumber, accessToken).then(getOrderDetailResponse).then(updateCompletedPickups);
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

    const handleYearOnChange = (event: any, newValue: string | null) => {
        setSelectedYear(newValue); // 선택된 값을 상태에 저장
    };
    const handleMonthOnChange = (event: any, newValue: string | null) => {
        setSelectedMonth(newValue); // 선택된 값을 상태에 저장
    };

    const handleStatusOnChange = (event: any, newValue: string | null) => {
        setSelectedStatus(newValue); // 선택된 값을 상태에 저장
    };

    const handleSortOnChange = (event: any, newValue: string | null) => {
        setSelectedSort(newValue); // 선택된 값을 상태에 저장
    };

    // Function: 정렬 설정 //
    useEffect(() => {
        let orderList = [...originalList.current];

        if (selectedYear) {
            orderList = originalList.current.filter(item => {
                const year = item.orderTime.slice(0, 4);
                return year === selectedYear;
            });
        }

        if (selectedMonth) {
            const selectedMonthNumber = String(monthProps.options.indexOf(selectedMonth) + 1).padStart(2, '0');
            orderList = originalList.current.filter(item => {
                const month = item.orderTime.slice(5, 7); // "2024-09-25T00:00" 에서 5~6번째 문자 가져오기
                return month === selectedMonthNumber;
            });
        }

        if (selectedYear == null) {
            setSelectedMonth(null);
        }

        if (selectedStatus) {
            orderList = originalList.current.filter(item => item.orderStatus === selectedStatus);
        }

        if (selectedSort === '빠른 주문일 순') {
            orderList.sort((a, b) => new Date(a.orderTime.split("T")[0]).getTime() - new Date(b.orderTime.split("T")[0]).getTime());
        } else if (selectedSort === '늦은 주문일 순') {
            orderList.sort((a, b) => new Date(b.orderTime.split("T")[0]).getTime() - new Date(a.orderTime.split("T")[0]).getTime());
        } else if (selectedSort === '가까운 픽업일 순') {
            orderList.sort((a, b) => new Date(a.pickupTime).getTime() - new Date(b.pickupTime).getTime()
            );
        } else if (selectedSort === '먼 픽업일 순') {
            orderList.sort((a, b) => new Date(b.pickupTime).getTime() - new Date(a.pickupTime).getTime()
            );
        }

        setOrderDetailList(orderList);
    }, [selectedYear, selectedMonth, selectedStatus, selectedSort]);

    return (
        <div className='order-history'>
            <div className='order-history-h2'>주문 관리</div>
            <div className='order-order'>
                <Autocomplete
                    {...yearProps}
                    id="include-input-in-list"
                    includeInputInList
                    style={{ minWidth: 150 }}
                    onChange={handleYearOnChange}
                    renderInput={(params) => (
                        <TextField {...params} label="년도 선택" variant="standard" />
                    )}
                />
                <Autocomplete
                    {...monthProps}
                    id="include-input-in-list"
                    includeInputInList
                    style={{ minWidth: 150 }}
                    onChange={handleMonthOnChange}
                    value={selectedYear ? selectedMonth : null}
                    renderInput={(params) => (
                        <TextField {...params} label="월 선택" variant="standard" placeholder={selectedYear ? "월 선택" : " "} />
                    )}
                />
                <Autocomplete
                    {...statusProps}
                    id="include-input-in-list"
                    includeInputInList
                    style={{ minWidth: 150 }}
                    onChange={handleStatusOnChange}
                    renderInput={(params) => (
                        <TextField {...params} label="상태 선택" variant="standard" />
                    )}
                />
                <Autocomplete
                    {...sortProps}
                    id="include-input-in-list"
                    includeInputInList
                    style={{ minWidth: 150 }}
                    onChange={handleSortOnChange}
                    renderInput={(params) => (
                        <TextField {...params} label="정렬 방식" variant="standard" />
                    )}
                />
            </div>
            <div className='my-order-list'>
                {
                    orderDetailList.map((orderdetail) => <MyOrderDetailComponent key={orderdetail.orderCode} orderdetail={orderdetail}
                        getOrderDetailList={getOrderDetailList} />)
                }
            </div>
            <div></div>
        </div>
    )
}
