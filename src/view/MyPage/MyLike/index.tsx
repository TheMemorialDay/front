import React, { MouseEvent, useEffect, useState } from 'react'
import './style.css';
import StoreComponent from '../../../components/storeThumbnail';
import MyStoreLikeComponentProps from '../../../types/mypage-likelist.interface';
import { useNavigate, useParams } from 'react-router';
import { ACCESS_TOKEN, SIGN_UP_ABSOLUTE_PATH, ST_ABSOLUTE_ORDER_DETAIL_PATH } from '../../../constants';
import { deleteLikeStoreRequest, getMyPageLikeStoreRequest, getMypageLikeStoreReviewNRatingRequest, postLikeStoreRequest } from '../../../apis';
import GetMyPageLikeStoreListResponseDto from '../../../apis/dto/response/like/get-mypage-likestore-list.response.dto';
import { ResponseDto } from '../../../apis/dto/response';
import { usePagination } from '../../../hooks';
import { useCookies } from 'react-cookie';
import { useSignInUserStore } from '../../../stores';
import { PostLikeStoreRequestDto } from '../../../apis/dto/request';
import axios from 'axios';
import { getMypageLikeStoreReviewNRating } from '../../../apis/dto/response/like';
import { MypageLikeStoreInfo } from '../../../types';

interface StoreRowProps {
    store: MyStoreLikeComponentProps,
    getStoreList: () => void,
}

// component: 스토어 리스트 아이템 컴포넌트 //
function StoreRow({ store, getStoreList }: StoreRowProps) {

    const navigator = useNavigate();

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: 로그인 유저 상태 //
    const { signInUser } = useSignInUserStore();
    const [likeCount, setLikeCount] = useState(store.likeList ? store.likeList.length : 0);
    const userId = signInUser?.userId;

    const onPostButtonClickHandler = () => {
        navigator(ST_ABSOLUTE_ORDER_DETAIL_PATH(store.storeNumber));
    };

    const [checked, setChecked] = useState<boolean>(true);

    const onHeartClickHandler = async (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (checked) {
            await onStoreLikeDeleteButtonClickHandler();
            // setLikeCount(likeCount - 1);
        }
    };

    // event handler: 가게 찜 버튼 삭제 이벤트 처리 //
    const onStoreLikeDeleteButtonClickHandler = async () => {

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            alert('접근 권한이 없습니다');
            return;
        }

        const storeNumber = store.storeNumber;
        if (!store.storeNumber) {
            alert('가게에 문제가 있습니다 !');
            return;
        }

        const userId = signInUser?.userId;
        if (!userId) {
            alert('유저 정보가 존재하지 않습니다!');
            return;
        }
        deleteLikeStoreRequest(userId, storeNumber.toString(), accessToken).then(deleteLikeStoreResponse);
    }

    // function: delete Like Store Response 처리 함수 //
    const deleteLikeStoreResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                        responseBody.code === 'NS' ? '존재하지 않는 가게 입니다' :
                            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        if (store.storeNumber == null) {
            alert('가게정보가 존재하지 않습니다');
            return;
        }
        setChecked(false);
    }

    // 쿠키에서 accessToken을 추출하는 함수 (TypeScript와 호환되는 코드)
    function getCookie(name: string): string | undefined {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift();
        }
        return undefined;
    }

    // effect: checked 상태가 변경될 때마다 리스트 업데이트
    useEffect(() => {
        const token = getCookie('accessToken');
        const accessToken = cookies[ACCESS_TOKEN];

        axios.get(`http://localhost:4000/mypage/like/${userId}/${store.storeNumber}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache', // 캐시 무효화
            },
        })
            .then(response => {
                // likeList의 길이로 likeCount를 업데이트
                const likeCount = response.data.likeList.length;
                setLikeCount(likeCount);

            })
            .catch(error => console.error(error));
        getStoreList();
    }, [store.storeNumber, checked]);

    // render: 스토어 리스트 컴포넌트 렌더링 //
    return (
        <div id="store-component-wrapper">
            <div className='store-card' onClick={onPostButtonClickHandler}>
                <div className='shop-image' style={{ backgroundImage: `url(${store.storeImageUrl})` }}></div>
                <div className='shop-info'>
                    <div className='liked'>
                        <h2 className="shop-name">{store.storeName}</h2>
                        <div onClick={onHeartClickHandler} className={checked ? 'red-heart' : 'white-heart'}>
                            <div className='like-count'>{likeCount}</div>
                        </div>
                    </div>
                    <p className="shop-location">{store.storeGugun} {store.storeDong}</p>
                    <p className="shop-rating">별점 {store.reviewRating?.toFixed(1)}</p>
                    <p className="shop-reviews">리뷰 {store.reviewCount}</p>
                </div>
            </div>
        </div>
    )
}

export default function MyLike() {

    // state: 로그인 유저 상태 //
    const { signInUser } = useSignInUserStore();

    // function: 네비게이터 함수 //
    const navigate = useNavigate();

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: 유저아이디 경로 변수 상태 //
    const { userId } = useParams();

    // state: 가게 리스트 상태 //
    const [storeList, setStoreList] = useState<MyStoreLikeComponentProps[]>([]);
    const [storeInfo, setStoreInfo] = useState<MypageLikeStoreInfo[]>([]);

    // function: like store list 불러오기 //
    const getMyPageStoreListResponse = (responseBody: GetMyPageLikeStoreListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                    responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { likes } = responseBody as GetMyPageLikeStoreListResponseDto;
        //setStoreList(likes);

        const newStoreList: MyStoreLikeComponentProps[] = likes.map((like) => {
            const ratingInfo = storeInfo.find(
                (rating) => rating.storeNumber === like.storeNumber
            );

            return {
                ...like,
                reviewRating: ratingInfo ? ratingInfo.reviewRating : 0,
                reviewCount: ratingInfo ? ratingInfo.reviewCount : 0,
            };

        })
        setStoreList(newStoreList);
    }

    // function: like store list를 서버에서 불러오는 함수 //
    const getStoreList = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            console.log('접근 권한이 없습니다.');
            return;
        }
        getMyPageLikeStoreRequest(userId ?? '', accessToken).then(getMyPageStoreListResponse);
    };

    // function: like store review count and review rating //
    const getStoreInfo = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;
        if (signInUser?.userId) {
            getMypageLikeStoreReviewNRatingRequest(signInUser?.userId, accessToken).then(getLikeStoreInfoResponse);
        }
    }

    // function: get like store info response 처리 함수 //
    const getLikeStoreInfoResponse = (responseBody: null | ResponseDto | getMypageLikeStoreReviewNRating) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' : responseBody;

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        const { reviewNRatings } = responseBody as getMypageLikeStoreReviewNRating;
        setStoreInfo(reviewNRatings);
    }

    // effect: 가게 정보 불러오기 함수 //
    useEffect(() => {
        if (!userId) {
            console.log('존재하지 않는 아이디입니다. 회원가입 페이지로 이동합니다.');
            navigate(SIGN_UP_ABSOLUTE_PATH);
            return;
        }

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            console.log('접근 권한이 없습니다.');
            return;
        }

        getStoreInfo();
        getStoreList();
    }, [userId]);

    return (
        <div id='mypage-like-wrapper'>
            <div className='title'>찜한 가게</div>
            <div className='like-main'>
                {
                    storeList.map((store) => <StoreRow key={store.storeNumber} store={store} getStoreList={getStoreList} />)
                }
            </div>
        </div>
    )
}