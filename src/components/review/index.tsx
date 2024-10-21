import { useEffect, useState } from "react";
import { ReviewComponentPros } from "../../types";
import './style.css';
import ReviewPhotoList from "../../types/review-images.interface";

// interface: 리뷰 사진 리스트 //
interface ReviewImageProps {
    reviewPhotos: ReviewPhotoList;
}

// component: 리뷰 상자 컴포넌트 //
export default function ReviewComponent({ reviewRating, reviewDay, reviewContents, productName, reviewPhotoUrl, imageCount}: ReviewComponentPros) {
    
    // state: 모달 팝업 상태 //
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    // state: 이미지 인덱스 상태 //
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    // event handler: 이전 사진으로 이동 //
    const nextClickHandler = () => {
        if (currentIndex < 0) return;
        if (currentIndex >= 0) setCurrentIndex(currentIndex + 1);
    };

    // event handler: 다음 사진으로 이동 //
    const prevClickHandler = () => {
        if (currentIndex > 4) return;
        if (currentIndex < 4) setCurrentIndex(currentIndex - 1);
    };

    // event handler: 모달 열기 //
    const onModalOpenClickHandler = () => {
        setModalOpen(true);
    };

    // event handler: 모달 닫기 //
    const onModalCloseHandler = () => {
        setModalOpen(false);
    }

    // effect: 모달창 상태에 따른 스크롤 바 상태 //
    useEffect(() => {
        document.body.style.overflow = modalOpen ? 'hidden' : 'auto';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [modalOpen]);

    // render: 리뷰 상자 컴포넌트 렌더링 //
    return (
        <div className="review-card">
            <div className="review-rating">
                <span className="star">⭐</span>
                <span className="rating-value">{reviewRating}</span>
            </div>
            <div className="review-details">
                <p className="review-date">{reviewDay}</p>
                <p className="review-text">{reviewContents}</p>
                <p className="review-product">상품 - {productName}</p>
            </div>
            <div className="review-image" onClick={onModalOpenClickHandler}>
                <div className='review-image-list' style={{ backgroundImage: `url(${reviewPhotoUrl})` }}></div>
                {imageCount &&
                    <div className="image-count">{imageCount}</div>
                }
            </div>

            {modalOpen &&
                <div className='myreview-modal' onClick={onModalCloseHandler}>
                    <div className='modal-box' onClick={(event) => event.stopPropagation()}>
                        <div className='arrow-left' onClick={prevClickHandler}></div>
                        {/* {reviewPhotos.reviewPhotoList.slice(currentIndex, currentIndex + 4)
                            .map((photo, index) =>
                            <div className='review-photo' key={index}>{photo}</div>
                        )} */}
                        <div className='arrow-right' onClick={nextClickHandler}></div>
                    </div>
                </div>
            }
        </div>
    );
};