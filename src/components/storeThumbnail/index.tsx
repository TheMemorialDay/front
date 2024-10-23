import { MouseEvent, useState } from "react";
import { StoreComponentProps } from "../../types";
import { useNavigate } from "react-router-dom";
import { ST_ABSOLUTE_ORDER_DETAIL_PATH } from "../../constants";
import './style.css';

export default function StoreComponent({ storeImageUrl, storeName, location, reviewRating, reviews }: StoreComponentProps) {

	const navigator = useNavigate();

	const onPostButtonClickHandler = () => {
		navigator(ST_ABSOLUTE_ORDER_DETAIL_PATH);
	};

	const [checked, setChecked] = useState<boolean>(false);

	const onHeartClickHandler = (event: MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
		checked ? setChecked(false) : setChecked(true);
	};

	return (
		<div id="store-component-wrapper">
			<div className='store-card' onClick={onPostButtonClickHandler}>
				<div className='shop-image' style={{ backgroundImage: `url(${storeImageUrl})` }}></div>
				<div className='shop-info'>
					<div className='liked'>
						<h2 className="shop-name">{storeName}</h2>
						<div onClick={onHeartClickHandler} className={checked ? 'red-heart' : 'white-heart'}></div>
					</div>


					<p className="shop-location">{location}</p>
					<p className="shop-rating">별점 {reviewRating}</p>
					<p className="shop-reviews">리뷰 {reviews}</p>
				</div>
			</div>
		</div>
	);
}