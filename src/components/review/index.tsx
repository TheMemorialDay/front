import { ReviewComponentPros } from "../../types";

export default function ReviewComponent({ rating, date, review, product, image, imageCount }: ReviewComponentPros) {
    return (
        <div className="review-card">
            <div className="review-rating">
                <span className="star">⭐</span>
                <span className="rating-value">{rating}</span>
            </div>
            <div className="review-details">
                <p className="review-date">{date}</p>
                <p className="review-text">{review}</p>
                <p className="review-product">상품 - {product}</p>
            </div>
            <div className="review-image">
                <div className='review-image-list' style={{ backgroundImage: `url(${image})` }}></div>
                {imageCount &&
                    <div className="image-count">{imageCount}</div>
                }
            </div>
        </div>
    );
};