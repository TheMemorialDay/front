import { useEffect, useState } from "react";
import { ReviewComponentPros } from "../../types";
import './style.css';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

// component: 리뷰 상자 컴포넌트 //
export default function ReviewComponent({ reviewRating, reviewDay, reviewContents, productName, reviewPhotoUrl, imageCount }: ReviewComponentPros) {

    // state: 모달 팝업 상태 //
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    // state: 이미지 인덱스 상태 //
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    // event handler: 모달 열기 //
    const onModalOpenClickHandler = () => {
        setModalOpen(true);
    };

    // event handler: 모달 닫기 //
    const onModalCloseHandler = () => {
        setModalOpen(false);
    }

    // event handler: 이전 사진으로 이동 //
    const nextClickHandler = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // event handler: 다음 사진으로 이동 //
    const prevClickHandler = () => {
        if (currentIndex < reviewPhotoUrl.length - 1) {  // 배열 길이에 맞게 조건 설정
            setCurrentIndex(currentIndex + 1);
        }
    };

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
            <div className="review-image" onClick={reviewPhotoUrl[0] !== undefined ? onModalOpenClickHandler : undefined} style={reviewPhotoUrl[0] !== undefined ? { cursor: "pointer" } : {}}>
                <div className='review-image-list' style={{ backgroundImage: `url(${reviewPhotoUrl[0]})` }}></div>
                {imageCount !== 0 ? <div className="image-count">{imageCount}</div> : ''}
            </div>
            {modalOpen &&
                <div className='myreview-modal' onClick={onModalCloseHandler}>
                    <div className='modal-box' onClick={(event) => event.stopPropagation()}>
                        <div className='arrow-left' onClick={nextClickHandler}></div>
                        <div className="slider-image-container">
                            <img src={reviewPhotoUrl[currentIndex]} alt={`Slide ${currentIndex}`} className="slider-image"
                                style={{ backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center", width: "500px", height: "500px" }} />
                        </div>
                        <div className='arrow-right' onClick={prevClickHandler}></div>
                    </div>
                </div>
            }
        </div>
    );
};