import React, { ChangeEvent, KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import './style.css';
import { FaRegStar, FaStar } from 'react-icons/fa';
import styled from "styled-components";
import { useOrderReject, useSignInUserStore } from '../../../stores';
import { Rating } from '@mui/material';
import { RequestPayParams, RequestPayResponse } from '../../../types/portone';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN } from '../../../constants';
import { PostPayMentRequestDto } from '../../../apis/dto/request';
import { fileUploadRequest, getOrderDetailRequest, patchOrderStatusRequest, postPayMentRequest, postReviewRequest } from '../../../apis';
import { ResponseDto } from '../../../apis/dto/response';
import GetOrderDetailResponseDto from '../../../apis/dto/response/get-order-detail-response-dto';
import GetOrderDetailListResponseDto from '../../../apis/dto/response/get-order-detail-list.response.dto';
import { OrderDetailsProps } from '../../../types';
import PatchOrderStatusReqeustDto from '../../../apis/dto/request/order/patch-order-status-request.dto';
import { Console } from 'console';
import { PostReviewRequestDto } from '../../../apis/dto/request/review';

// interface: 주문 내역 컴포넌트 Properties //
interface OrderDetailProps {
    orderdetail: OrderDetailsProps,
    getOrderDetailList: () => void;
};

// component: 주문 내역 컴포넌트 //
function MyOrderDetailComponent({ orderdetail, getOrderDetailList }: OrderDetailProps) {

    type OrderStatus = '승인 대기중' | '결제 대기중' | '결제 완료' | '리뷰 쓰기' | '완료' | '주문 취소' | '주문 거부' | '픽업 완료' | '리뷰작성 완료';

    const { options, orderCode, storeName, productName } = orderdetail;

    // state: order 상태 관리 //
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(orderdetail.orderStatus as OrderStatus);

    const { orderReject, setOrderRejectStatus, cancelReason, setCancelReason } = useOrderReject();
    const { signInUser } = useSignInUserStore();
    const [userId, setUserId] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [orderTime, setOrderTime] = useState<string>('');

    const [cookies] = useCookies();

    // component: 결제창 //
    const onClickPayment = () => {
        if (!window.IMP) return;
        /* 1. 가맹점 식별하기 */
        const { IMP } = window;
        IMP.init("imp84260646"); // 가맹점 식별코드

        /* 2. 결제 데이터 정의하기 */
        const data: RequestPayParams = {
            pg: "html5_inicis", // PG사 : https://developers.portone.io/docs/ko/tip/pg-2 참고
            pay_method: "card", // 결제수단
            merchant_uid: `${orderdetail.orderCode}`, // 주문번호
            amount: Number(`${orderdetail.totalPrice}`), // 결제금액
            name: `${orderdetail.productName}`, // 주문명 (제품명 Order에서 받기)
            buyer_name: `${userName}`, // 구매자 이름 (userName)
            buyer_email: ``,
            buyer_tel: `${signInUser?.telNumber}`, // 구매자 전화번호 (signInUser.telNumber)
        };

        /* 4. 결제 창 호출하기 */
        IMP.request_pay(data, callback);
    };

    // component: 결제창 콜백 함수 //
    function callback(response: RequestPayResponse) {
        const { success, error_msg, paid_amount, merchant_uid } = response;

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        const onPostPayMentEvent = () => {
            const requestBody: PostPayMentRequestDto = {
                orderCode: merchant_uid,
                userId: userId,
                success: success,
                paidAmount: paid_amount
            };
            postPayMentRequest(requestBody, accessToken).then(postPayMentResponse);
        }

        // function: post PayMent response 처리 함수 //
        const postPayMentResponse = (responseBody: ResponseDto | null) => {
            const message =
                !responseBody ? '서버에 문제가 있습니다.' :
                    responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
                        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

            const isSuccessed = responseBody !== null && responseBody.code === 'SU';
            if (!isSuccessed) {
                alert(message);
                return;
            }
        }

        if (success) {
            setOrderStatus('결제 완료');
            onPostPayMentEvent();
        } else {
            alert(`결제 실패: ${error_msg}`);
        }
    };

    // function: 숫자 쉼표 찍어주는 함수 //
    function formatNumberWithCommas(number: number): string {
        return new Intl.NumberFormat('en-US').format(number);
    }

    // function: 상태 변경 //
    const onUpdateOrderStatus = () => {

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            console.log('토큰 오류');
            return;
        }

        const requestBody: PatchOrderStatusReqeustDto = {
            orderCode: orderdetail.orderCode,
            orderStatus: orderStatus
        };
        patchOrderStatusRequest(requestBody, orderdetail.orderCode, accessToken).then(patchOrderStatusResponse).then(getOrderDetailList);

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

    // component: 승인 대기중 //
    function ReadyAccept() {
        return (
            <div className='my-order-status'>
                <div className='order-cancle' onClick={() => setOrderStatus('주문 취소')}>주문 취소</div>
            </div >
        );
    };

    // component: 결제 대기중 //
    function ReadyPay() {
        return (
            <div className='my-order-payed-status'>
                <div className='go-payed' onClick={onClickPayment}>결제</div>
                <div className='order-payed-cancle' onClick={() => setOrderStatus('주문 취소')}>주문 취소</div>
            </div>
        );
    };

    // component: 결제 완료 //
    function FinishedPay() {
        return (
            <div className='my-order-status'>
                <div className='order-cancle' onClick={() => { setOrderStatus('주문 취소'); }}>환불 요청</div>
            </div>
        );
    }

    // component: 주문 완료 //
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
        const [value, setValue] = React.useState<number | null>(5);
        const [reviewContents, setReviewContents] = useState<string>('');
        
        const today = new Date();
        const formattedDate: string = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;


        const openFileDialog = () => {
            fileInputRef.current?.click();
        };

        // event handler: 리뷰 내용 변경 이벤트 핸들러 //
        const onReviewContentsChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
            const {value} = event.target;
            setReviewContents(value);
        }

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

        // function: post review response 처리 함수 //
        const postReviewResponse = (responseBody: ResponseDto | null) => {
            const message = 
                !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
                responseBody.code === 'AF' ? '잘못된 접근입니다.' : 
                responseBody.code === 'VF' ? '잘못된 값입니다.' : '';
            
            const isSuccessed = responseBody !== null && responseBody.code === 'SU';
            if(isSuccessed) {
                alert(message);
                return;
            }
            
        }

        // event handler: 등록 버튼 클릭 이벤트 핸들러 //
        const onRegisterClickHandler = async() => {

            const accessToken = cookies[ACCESS_TOKEN];
            if (!accessToken) return;
            
            if(signInUser?.userId) {

                let urls: string[] = [];
                for (const file of selectedFiles) {
                    const formData = new FormData();
                    formData.append('file', file);
                    let url = await fileUploadRequest(formData);
                    console.log(url);
                    if (url) urls.push(url);
                    console.log(urls);
                }

                const requestBody: PostReviewRequestDto = {
                    orderCode, 
                    reviewRating: value, 
                    reviewDay: today,
                    reviewContents, 
                    storeName: storeName.split(",")[1], 
                    productName, 
                    userId,
                    imageUrls: urls
                };
                console.log(requestBody);
                postReviewRequest(requestBody, accessToken).then(postReviewResponse);
            }
            setOrderStatus("완료");
        }

        // component: 별 표기 //

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
                            <div className='review-photo-reset-button' onClick={onResetImagesHandler}>초기화</div>
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
                                <p>가게명 : {orderdetail.storeName.split(",")[1]}</p>
                                <p>상품 : {orderdetail.productName}</p>
                                <p className='review-star'>별점 : &nbsp; <Rating
                                    name="simple-controlled"
                                    value={value}
                                    onChange={(event, newValue) => {
                                        setValue(newValue);
                                    }}
                                /></p>
                            </div>
                            <textarea className='review-content' placeholder='리뷰를 작성해주세요(최대 100자).' maxLength={100} 
                                onChange={onReviewContentsChange}/>
                            <div className='review-bottom'>
                                <div className='button disable' onClick={() => setModalOpen(false)}>취소</div>
                                <div className='button' onClick={onRegisterClickHandler}>등록</div>
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
            setUserName(signInUser.name);
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
        <>
            <div className='order-day'>{orderdetail.orderTime.split("T")[0]}</div>
            <div className='order-list-component'>
                <div className='my-order-order'>
                    <div className='order-box-top'>
                        <div>
                            {
                                orderStatus === '승인 대기중' ? '승인 대기중' :
                                    orderStatus === '주문 취소' ? '주문 취소' :
                                        orderStatus === '결제 대기중' ? '결제 대기중' :
                                            orderStatus === '결제 완료' ? '결제 완료' :
                                                orderStatus === '리뷰작성 완료' ? '완료' :
                                                    orderStatus === '완료' ? <WriteReview /> :
                                                        orderStatus === '주문 거부' ? '주문 거부' : ''
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
                            {/* <p className="order-option">{option.productCategory}</p> */}
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
                        <div className="order-value">금액 : {formatNumberWithCommas(orderdetail.totalPrice)}원</div>
                    </div>
                </div>
                {

                    orderStatus === '승인 대기중' ? <ReadyAccept /> :
                        orderStatus === '결제 대기중' ? <ReadyPay /> :
                            orderStatus === '결제 완료' ? <FinishedPay /> :
                                orderStatus === '완료' ? <FinishedOrder /> :
                                    orderStatus === '주문 거부' ? <OrderReject /> : ''
                }
            </div >
        </>

    );

};

export default function MyOrderDetail() {

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
        if (!accessToken || !signInUser) {
            console.log('접근 권한이 없습니다.');
            return;
        }
        getOrderDetailRequest(signInUser.userId, accessToken).then(getOrderDetailResponse);
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

    // render: 주문 내역 컴포넌트 렌더링 //
    return (
        <div className='order-history'>
            <div className='order-history-h2'>주문 내역</div>

            <div className='my-order-list'>
                {
                    orderDetailList.map((orderdetail) => <MyOrderDetailComponent key={orderdetail.orderCode} orderdetail={orderdetail} getOrderDetailList={getOrderDetailList} />)
                }
            </div>
            <div></div>
        </div>
    )
}
