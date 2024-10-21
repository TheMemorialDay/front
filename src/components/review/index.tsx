import { ReviewComponentPros } from "../../types";

export default function ReviewComponent({ reviewRating, reviewDay, reviewContents, productName, reviewPhotoUrl, imageCount }: ReviewComponentPros) {
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
            <div className="review-image">
                <div className='review-image-list' style={{ backgroundImage: `url(${reviewPhotoUrl})` }}></div>
                {imageCount &&
                    <div className="image-count">{imageCount}</div>
                }
            </div>
        </div>
    );
};