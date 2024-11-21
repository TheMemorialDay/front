import { useNavigate, useOutletContext, useParams } from 'react-router';
import './style.css';
import React, { useEffect, useState } from 'react'
import { ST_ABSOLUTE_CONTACT_DETAIL_PATH, ST_ABSOLUTE_INFORMATION_DETAIL_PATH, ST_ABSOLUTE_ORDER_DETAIL_PATH, ST_ABSOLUTE_REVIEW_DETAIL_PATH, ST_PRODUCT_ORDER_ABSOLUTE_PATH } from '../../../constants';
import { GetProductPreviewListResponseDto, GetStoreResponseDto } from '../../../apis/dto/response/stores';
import { getProductPreviewListRequest } from '../../../apis';
import { ResponseDto } from '../../../apis/dto/response';


export default function ShopOrder() {

  const { storeNumber } = useParams();

  const navigator = useNavigate();

  const { store } = useOutletContext<{ store: GetStoreResponseDto | null }>();

  // state: 상품 리스트 상태 //
  const [productList, setProductList] = useState<ShopComponentProps[]>([]);

  const onProductClickHandler = (productNumber: number | string) => {
    if (storeNumber) {
      navigator(ST_PRODUCT_ORDER_ABSOLUTE_PATH(storeNumber, productNumber));
    }
  }

  const onOrderButtonClickHandler = () => {
    if (store)
      navigator(ST_ABSOLUTE_ORDER_DETAIL_PATH(store.storeNumber));
  };

  const onInformationButtonClickHandler = () => {
    if (store)
      navigator(ST_ABSOLUTE_INFORMATION_DETAIL_PATH(store.storeNumber));
  };

  const onContactButtonClickHandler = () => {
    if (store)
      navigator(ST_ABSOLUTE_CONTACT_DETAIL_PATH(store.storeNumber));
  };

  const onReviewButtonClickHandler = () => {
    if (store)
      navigator(ST_ABSOLUTE_REVIEW_DETAIL_PATH(store.storeNumber));
  };

  // function: 숫자 쉼표 찍어주는 함수 //
  function formatNumberWithCommas(number: number): string {
    return new Intl.NumberFormat('en-US').format(number);
  }

  // function: get product list preview respone 처리 //
  const getProductListPreviewResponse = (responseBody: ResponseDto | null | GetProductPreviewListResponseDto) => {
    const message =
      !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'DBE' ? "서버에 문제가 있습니다." :
          responseBody.code === 'NP' ? '존재하지 않는 상품입니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }
    const { previewProducts } = responseBody as GetProductPreviewListResponseDto;

    const formattedProducts = previewProducts.map(product => ({
      productNumber: product.productNumber,
      imageUrl: product.productImage,
      title: product.productName,
      price: product.productPrice, // Ensure price is a string
      hashtags: product.themes.join(' '), // Join themes into a single string for display
      onDetailClickHandler: () => onProductClickHandler(product.productNumber),
      productToday: product.productToday
    }));

    setProductList(formattedProducts);
  }

  // function: store list 불러오기 함수 //
  const getProductList = () => {
    if (storeNumber) {
      getProductPreviewListRequest(storeNumber).then(getProductListPreviewResponse);
    }
  }

  // Effect: 가게 상품 리스트 불러오기 //
  useEffect(() => {
    getProductList();
  }, [storeNumber]);

  interface ShopComponentProps {
    productNumber: number;
    imageUrl: string;
    title: string;
    price: number;
    hashtags: string;
    onDetailClickHandler: (productNumber: number | string) => void;
    productToday: boolean;
  };

  function ShopComponent({ productNumber, imageUrl, title, price, hashtags, onDetailClickHandler, productToday }: ShopComponentProps) {

    const [hover, setHover] = useState(false);

    return (
      <div className="cake-item"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ backgroundImage: `url(${imageUrl})` }}
        key={productNumber}
      >
        {hover && (
          <div className="cake-overlay" onClick={() => onDetailClickHandler(productNumber)}>
            <h2>{title}</h2>
            <p className='hashtags' style={{ fontSize: "13px", fontWeight: "400" }}>{hashtags}</p>
            <p className='price'>{formatNumberWithCommas(price)}원</p>
            {productToday ? <p>당일 케이크 가능</p> : ''}
          </div>
        )}
      </div>
    );
  };


  return (
    <div id='store-detail-wrapper'>
      <div className='menu-bar-order'>
        <div className='shop-order' onClick={onOrderButtonClickHandler}>주문하기</div>
        <div className='shop-information' onClick={onInformationButtonClickHandler}>매장정보</div>
        <div className='shop-contact' onClick={onContactButtonClickHandler}>문의하기</div>
        <div className='shop-review' onClick={onReviewButtonClickHandler}>리뷰</div>
      </div>
      <div className='product'>
        {
          productList.map((product, index) => (
            <ShopComponent
              key={product.productNumber}
              productNumber={product.productNumber}
              imageUrl={product.imageUrl}
              title={product.title}
              price={product.price}
              hashtags={product.hashtags}
              onDetailClickHandler={product.onDetailClickHandler}
              productToday={product.productToday} />
          ))
        }
      </div>
    </div>
  )
}
