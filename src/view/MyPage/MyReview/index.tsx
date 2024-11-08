import React, { useEffect, useState } from 'react'
import './style.css';
import ReviewComponent from '../../../components/review';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, LOGIN_PATH, ST_ABSOLUTE_ORDER_DETAIL_PATH } from '../../../constants';
import { useSignInUserStore } from '../../../stores';
import { useCookies } from 'react-cookie';
import { getMyReviewListRequest } from '../../../apis';
import { ResponseDto } from '../../../apis/dto/response';
import { GetMyReviewListResponseDto } from '../../../apis/dto/response/mypage-review';
import MyReviews from '../../../apis/dto/response/mypage-review/my-reivew';


// component: 마이페이지 리뷰 컴포넌트 //
export default function MyReview() {

    const sampleArray: string[] = ["apple", "banana", "cherry", "date"];

    // state: 로그인 한 유저 //
    const {signInUser} = useSignInUserStore();
    const [cookies] = useCookies();

    const [myReviewList, setMyReviewList] = useState<MyReviews[]>([]);

    // function: 네비게이터 //
    const navigator = useNavigate();

    // function: get my review 불러오기 //
    const getMyReviewList = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        
        if(!accessToken || !signInUser) {
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
        if(!isSuccessed) {
            alert(message);
            return;
        }

        const {myReviews} = responseBody as GetMyReviewListResponseDto;
        console.log(myReviewList);
        setMyReviewList(myReviews);
    }

    // event handler: 상자 클릭 시 해당 가게 상세 페이지로 이동 //
    const onItemDetailClickHandler = (path: string) => {
        navigator(path);
    };

    // effect: my review list 불러오기 //
    useEffect(getMyReviewList, [])

    // render: 마이페이지 리뷰 컴포넌트 렌더링 //
    return (
        <div id='mypage-review-wrapper'>
            <div className='title'>REVIEW</div>
            <div className='main'>

                {myReviewList.map((myReview, index) => 
                    <div style={{marginTop: "30px"}}>
                        <div className='main-title'>{myReview.storeName}</div>
                        <div className='review-box'>
                            <ReviewComponent
                                reviewRating={myReview.reviewRating.toFixed(1)}
                                reviewDay={myReview.reviewDay.split("T")[0]}
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
