import React, { useEffect, useState } from 'react'
import './style.css';
import ReviewComponent from '../../../components/review';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, ST_ABSOLUTE_ORDER_DETAIL_PATH } from '../../../constants';
import { useSignInUserStore } from '../../../stores';
import { useCookies } from 'react-cookie';
import { getMyReviewListRequest } from '../../../apis';
import { ResponseDto } from '../../../apis/dto/response';
import { GetMyReviewListResponseDto } from '../../../apis/dto/response/mypage-review';
import MyReviews from '../../../apis/dto/response/mypage-review/my-reivew';


// component: 마이페이지 리뷰 컴포넌트 //
export default function MyReview() {

    // state: 로그인 한 유저 //
    const { signInUser } = useSignInUserStore();
    const [cookies] = useCookies();

    // state: 마우스 상태 //
    const [startX, setStartX] = useState(0);
    const [isDraggingLeft, setIsDraggingLeft] = useState(false);
    const [myReviewList, setMyReviewList] = useState<MyReviews[]>([]);

    // function: 네비게이터 //
    const navigator = useNavigate();

    // function: get my review 불러오기 //
    const getMyReviewList = () => {
        const accessToken = cookies[ACCESS_TOKEN];

        if (!accessToken || !signInUser) {
            alert('error');
            return;
        } else {
            const userID = signInUser.userId;
            getMyReviewListRequest(userID, accessToken).then(getMyReviewListResponse);
        }

    }

    // function: get my review list response 처리 함수 //
    const getMyReviewListResponse = (responseBody: null | ResponseDto | GetMyReviewListResponseDto) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
                    responseBody.code === 'NI' ? '잘못된 접근입니다.' :
                        responseBody.code === 'NR' ? '작성된 리뷰가 없습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { myReviews } = responseBody as GetMyReviewListResponseDto;
        setMyReviewList(myReviews);
    }

    // event handler: 상자 클릭 시 해당 가게 상세 페이지로 이동 //
    const onItemDetailClickHandler = (path: number) => {
        navigator(ST_ABSOLUTE_ORDER_DETAIL_PATH(path));
    };

    // function: 9시간 더하기 //
    const addHoursToDate = (dateString: string, hours: number) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() + hours);
        return date.toISOString();
    }

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        setStartX(e.clientX); // 드래그 시작 시 마우스 X 좌표 저장
        setIsDraggingLeft(false);
    };

    const handleDragEnd = () => {
        if (isDraggingLeft) {
            // 왼쪽으로 드래그된 경우에만 특별 이벤트 발생
            // onDeleteReview(myReview.id);
            console.log('이벤트 발생');
        }
        setIsDraggingLeft(false); // 드래그 종료 후 상태 초기화
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        // 현재 마우스 위치가 시작 위치보다 왼쪽에 있을 때만 isDraggingLeft 설정
        if (e.clientX < startX - 50) { // -50은 이동 거리 기준 (조정 가능)
            setIsDraggingLeft(true);
        }
    };

    // effect: my review list 불러오기 //
    useEffect(getMyReviewList, [])

    // render: 마이페이지 리뷰 컴포넌트 렌더링 //
    return (
        <div id='mypage-review-wrapper'>
            <div className='title'>REVIEW</div>
            <div className='main'>
                {myReviewList.map((myReview, index) =>
                    <div style={{ marginTop: "30px" }}>
                        <div className='main-title'>
                            <span className='title-span' onClick={() => onItemDetailClickHandler(myReview.storeNumber)}>
                                {myReview.storeName}
                            </span>
                        </div>
                        {isDraggingLeft && <div className="overlay" />}
                        <div className='review-box' draggable="true" onDragStart={handleDragStart} onDragOver={handleDragOver}
                            onDragEnd={handleDragEnd}
                            style={{ cursor: 'grab' }}>
                            <ReviewComponent
                                reviewRating={myReview.reviewRating.toFixed(1)}
                                reviewDay={addHoursToDate(myReview.reviewDay, 9).split("T")[0]}
                                reviewContents={myReview.reviewContents}
                                productName={myReview.productName}
                                reviewPhotoUrl={myReview.imageUrls}
                                imageCount={myReview.imageUrls.length}
                            />
                        </div>
                    </div>)
                }
            </div>
        </div>
    )
}
