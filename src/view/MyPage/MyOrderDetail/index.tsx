import React, { ChangeEvent, KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import './style.css';
import { useSignInUserStore } from '../../../stores';
import { Autocomplete, Rating, TextField } from '@mui/material';
import { RequestPayParams, RequestPayResponse } from '../../../types/portone';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, ST_ABSOLUTE_ORDER_DETAIL_PATH } from '../../../constants';
import { PostPayMentRequestDto } from '../../../apis/dto/request';
import { fileUploadRequest, getOrderDetailRequest, patchOrderStatusRequest, postPayMentRequest, postReviewRequest } from '../../../apis';
import { ResponseDto } from '../../../apis/dto/response';
import GetOrderDetailListResponseDto from '../../../apis/dto/response/get-order-detail-list.response.dto';
import { NewOrderDetailsProps } from '../../../types';
import PatchOrderStatusReqeustDto from '../../../apis/dto/request/order/patch-order-status-request.dto';
import { PostReviewRequestDto } from '../../../apis/dto/request/review';
import { useNavigate } from 'react-router-dom';

// interface: 주문 내역 컴포넌트 Properties //
interface OrderDetailProps {
    orderdetail: NewOrderDetailsProps,
    getOrderDetailList: () => void;
};

// component: 주문 내역 컴포넌트 //
function MyOrderDetailComponent({ orderdetail, getOrderDetailList }: OrderDetailProps) {

    type OrderStatus = '승인 대기중' | '결제 대기중' | '결제 완료' | '리뷰 쓰기' | '완료' | '주문 취소' | '주문 거부' | '픽업 완료';

    const { options, orderCode, storeName, productName } = orderdetail;

    // state: order 상태 관리 //
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(orderdetail.orderStatus as OrderStatus);

    const { signInUser } = useSignInUserStore();
    const [cancelCode, setCancelCode] = useState<string>('');
    const [cancelReason, setCancelReason] = useState<string>('');

    const [cookies] = useCookies();

    // component: 결제창 //
    const onClickPayment = () => {
        if (!window.IMP) return;
        /* 1. 가맹점 식별하기 */
        const { IMP } = window;
        const Apikey = process.env.REACT_APP_PAYMENT_API_KEY as string;
        IMP.init(Apikey); // 가맹점 식별코드

        // user이름 등록


        /* 2. 결제 데이터 정의하기 */
        const data: RequestPayParams = {
            pg: "html5_inicis", // PG사 : https://developers.portone.io/docs/ko/tip/pg-2 참고
            pay_method: "card", // 결제수단
            merchant_uid: `${orderdetail.orderCode}`, // 주문번호
            amount: Number(`${orderdetail.totalPrice}`), // 결제금액
            name: `${orderdetail.productName}`, // 주문명 (제품명 Order에서 받기)
            buyer_name: `${signInUser?.userId}`, // 구매자 이름 (userName)
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

            if (signInUser?.userId !== null && signInUser?.userId !== undefined) {
                const requestBody: PostPayMentRequestDto = {
                    orderCode: merchant_uid,
                    userId: signInUser?.userId,
                    success: success,
                    paidAmount: paid_amount
                };
                postPayMentRequest(requestBody, accessToken).then(postPayMentResponse);

                setOrderStatus('결제 완료');
                const requestBodys: PatchOrderStatusReqeustDto = {
                    orderCode: orderdetail.orderCode,
                    orderStatus: '결제 완료'
                };
                patchOrderStatusRequest(requestBodys, orderdetail.orderCode, accessToken).then(patchOrderStatusResponse).then(getOrderDetailList);
            }
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
            onPostPayMentEvent();
        } else {
            alert(`결제 실패: ${error_msg}`);
        }
    };

    // function: 숫자 쉼표 찍어주는 함수 //
    function formatNumberWithCommas(number: number): string {
        return new Intl.NumberFormat('en-US').format(number);
    }

    // function: navigator //
    const navigator = useNavigate();

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

    // Function: 주문 취소 클릭 핸들러 //
    const onAcccpetUpdateOrderStatus = () => {
        setOrderStatus('주문 취소');

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            alert('토큰 오류');
            return;
        }

        const requestBody: PatchOrderStatusReqeustDto = {
            orderCode: orderdetail.orderCode,
            orderStatus: '주문 취소'
        };
        patchOrderStatusRequest(requestBody, orderdetail.orderCode, accessToken).then(patchOrderStatusResponse).then(getOrderDetailList);
    }

    // event handler: 이미지 파일 확인 클릭 핸들러 //
    const onImageFileCheckHandler = (url: string | undefined) => {
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
        else {
            alert("이미지 파일이 없습니다.");
            return;
        }
    }

    // event handler: 가게 이름 클릭 이벤트 핸들러 //
    const onClickStoreNumber = (number: number | string) => {
        navigator(ST_ABSOLUTE_ORDER_DETAIL_PATH(number));
    }

    // component: 승인 대기중 //
    function ReadyAccept() {
        return (
            <div className='my-order-status'>
                <div className='order-cancle' onClick={() => onAcccpetUpdateOrderStatus()}>주문 취소</div>
            </div >
        );
    };

    // component: 결제 대기중 //
    function ReadyPay() {
        return (
            <div className='my-order-payed-status'>
                <div className='go-payed' onClick={onClickPayment}>결제</div>
                <div className='order-payed-cancle' onClick={() => onAcccpetUpdateOrderStatus()}>주문 취소</div>
            </div>
        );
    };

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

        if (orderdetail.cancelCode) {
            setCancelCode(orderdetail.cancelCode);
        }

        if (orderdetail.cancelReason) {
            setCancelReason(orderdetail.cancelReason);
        }

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
                                    <div className='reject-reason'>{cancelCode} 🤣</div> : <div className='reject-reason'>{cancelReason} 🤣</div>
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
            const { value } = event.target;
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
            if (!isSuccessed) {
                alert(message);
                return;
            }

        }

        // event handler: 등록 버튼 클릭 이벤트 핸들러 //
        const onRegisterClickHandler = async () => {

            const accessToken = cookies[ACCESS_TOKEN];
            if (!accessToken) return;


            if (signInUser?.userId !== null && signInUser?.userId !== undefined) {

                const userId = signInUser?.userId;

                let urls: string[] = [];
                for (const file of selectedFiles) {
                    const formData = new FormData();
                    formData.append('file', file);
                    let url = await fileUploadRequest(formData);
                    if (url) urls.push(url);
                }

                const requestBody: PostReviewRequestDto = {
                    orderCode,
                    reviewRating: value,
                    reviewDay: today,
                    reviewContents,
                    storeName: storeName.split(",")[1],
                    productName,
                    userId: userId,
                    imageUrls: urls
                };
                postReviewRequest(requestBody, accessToken).then(postReviewResponse);

                const requestBodys: PatchOrderStatusReqeustDto = {
                    orderCode: orderdetail.orderCode,
                    orderStatus: '완료'
                };
                patchOrderStatusRequest(requestBodys, orderdetail.orderCode, accessToken).then(patchOrderStatusResponse).then(getOrderDetailList);
            }
            setOrderStatus("완료");
        }

        // event handler: 이미지 파일 확인 클릭 핸들러 //
        const onImageFileCheckHandler = (url: string | undefined) => {
            if (url) window.open(url, '_blank', 'noopener,noreferrer');
            else {
                alert("이미지 파일이 없습니다.");
                return;
            }
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
                                onChange={onReviewContentsChange} />
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
                                                orderStatus === '완료' ? '완료' :
                                                    orderStatus === '픽업 완료' ? <WriteReview /> :
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
                            <p style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
                                <div className="order-product" onClick={() => onClickStoreNumber(orderdetail.storeNumber)}>{(orderdetail.storeName).split(",")[1]}</div>
                                <div>- {orderdetail.productName}</div>
                            </p>
                            <div className="order-productCategory-productContents">
                                <div>옵션:
                                    {options.map((option, index) => (
                                        <span key={index} className="order-option">
                                            {option.productCategory ? option.productCategory : '없음'}
                                            {index < options.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </div>
                                {orderdetail.photoUrl ?
                                    <div className='check-image-file' onClick={() => onImageFileCheckHandler(orderdetail.photoUrl)}>이미지 파일 확인</div>
                                    : ''
                                }
                            </div>
                            <div className='request-contents'>
                                <div style={{ width: "65px", display: "inline-block" }}>요청사항:</div>
                                <div className='real-contents'>{orderdetail.productContents ? orderdetail.productContents : '없음'}</div>
                            </div>
                            <p className="order-plan">픽업일시 {orderdetail.pickupTime}</p>
                        </div>
                        <div className="order-value">금액 : {formatNumberWithCommas(orderdetail.totalPrice)}원</div>
                    </div>
                </div>
                {

                    orderStatus === '승인 대기중' ? <ReadyAccept /> :
                        orderStatus === '결제 대기중' ? <ReadyPay /> :
                            orderStatus === '완료' ? <FinishedOrder /> :
                                orderStatus === '주문 거부' ? <OrderReject /> : ''
                }
            </div >
        </>
    );
};

export default function MyOrderDetail() {

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
        const { orderManages } = responseBody as GetOrderDetailListResponseDto;
        setOrderDetailList(orderManages);
        originalList.current = orderManages;
    }

    // Function: 픽업 완료 상태 업데이트 함수 //
    const updateCompletedPickups = async () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            alert('토큰 오류');
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
            try {
                await patchOrderStatusRequest(requestBody, order.orderCode, accessToken);
            } catch (error) {
                console.error('주문 상태 업데이트 오류:', error);
            }
        }
    };

    // function: order detail list 불러오기 함수                                                가장 처음 리스트 불러오는 함수 //
    const getOrderDetailList = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken || !signInUser) {
            alert('접근 권한이 없습니다.');
            return;
        }
        getOrderDetailRequest(signInUser.userId, accessToken).then(getOrderDetailResponse).then(updateCompletedPickups);
    }

    // effect: 유저 정보 불러오기 함수 //
    useEffect(() => {
        if (signInUser) {
            setUserId(signInUser.userId);
        }

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            alert('접근 권한이 없습니다.');
            return;
        }
        getOrderDetailList();
    }, [signInUser]);

    // Function: 정렬 설정 //
    useEffect(() => {
        let orderList = [...originalList.current];

        // 연도 필터링
        if (selectedYear) {
            orderList = orderList.filter(item => {
                const year = item.orderTime.slice(0, 4);
                return year === selectedYear;
            });
        }

        // 월 필터링
        if (selectedMonth) {
            const selectedMonthNumber = String(monthProps.options.indexOf(selectedMonth) + 1).padStart(2, '0');
            orderList = orderList.filter(item => {
                const month = item.orderTime.slice(5, 7);
                return month === selectedMonthNumber;
            });
        }

        // 상태 필터링
        if (selectedStatus) {
            orderList = orderList.filter(item => item.orderStatus === selectedStatus);
        }

        // 정렬 설정
        if (selectedSort === '빠른 주문일 순') {
            orderList.sort((a, b) => new Date(a.orderTime.split("T")[0]).getTime() - new Date(b.orderTime.split("T")[0]).getTime());
        } else if (selectedSort === '늦은 주문일 순') {
            orderList.sort((a, b) => new Date(b.orderTime.split("T")[0]).getTime() - new Date(a.orderTime.split("T")[0]).getTime());
        } else if (selectedSort === '가까운 픽업일 순') {
            orderList.sort((a, b) => new Date(a.pickupTime).getTime() - new Date(b.pickupTime).getTime());
        } else if (selectedSort === '먼 픽업일 순') {
            orderList.sort((a, b) => new Date(b.pickupTime).getTime() - new Date(a.pickupTime).getTime());
        }

        setOrderDetailList(orderList);
    }, [selectedYear, selectedMonth, selectedStatus, selectedSort]);

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

    // render: 주문 내역 컴포넌트 렌더링 //
    return (
        <div className='order-history'>
            <div className='order-history-h2'>주문 내역</div>
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
                    orderDetailList.map((orderdetail) => <MyOrderDetailComponent key={orderdetail.orderCode} orderdetail={orderdetail} getOrderDetailList={getOrderDetailList} />)
                }
            </div>
            <div></div>
        </div>
    )
}
