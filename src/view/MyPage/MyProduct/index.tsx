import React, { useEffect, useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, MY_PRODUCT_ADD_ABSOLUTE_PATH, MY_PRODUCT_UPDATE_ABSOLUTE_PATH } from '../../../constants';
import { getProductListRequest } from '../../../apis';
import { Product } from '../../../types';
import { GetProductListResponseDto } from '../../../apis/dto/response/product';
import { ProductResponse } from '../../../apis/dto/response/product/get-product-list-response.dto';
import { useSignInUserStore } from '../../../stores';
import { useCookies } from 'react-cookie';

// const {signInUser} = useSignInUserStore();
// const [userId, setUserId] = useState<string>('');

const defaultProfileImageUrl = 'https://blog.kakaocdn.net/dn/4CElL/btrQw18lZMc/Q0oOxqQNdL6kZp0iSKLbV1/img.png';

// component: 기존 상품 박스 컴포넌트
function Legacy({ product, onEdit }: { product: Product; onEdit: (productNumber: number) => void }) {
    const onDeleteButtonClickHandler = () => {
        const isConfirm = window.confirm("정말 삭제하시겠습니까?");
        if (!isConfirm) return;

        // 삭제 처리 로직 추가 필요
        console.log(`Deleting product with ID: ${product.productNumber}`);
    };

    return (
        <div className='legacy-product' onClick={() => onEdit(product.productNumber)}>
            <div className='images-box'>
                <div className='legacy-product'
                    style={{
                        backgroundImage: `url(${product.productImageUrl || defaultProfileImageUrl})`,
                    }}
                />
            </div>
            <div className="close-button" onClick={onDeleteButtonClickHandler}>X</div>
        </div>
    );
}
const convertProductResponseToProduct = (response: ProductResponse): Product => {
    return {
        productNumber: response.productNumber,
        productImageUrl: response.imageUrl || defaultProfileImageUrl,
        productName: response.productName,
        productIntroduce: response.productIntroduce,
        productPrice: response.productPrice,
        productToday: false,
        productTag: '',
        options: [],
        themes: [],
        productImages: [],
    };
};


// component: 상품 관리 화면 컴포넌트
export default function MyProduct() {
    const [products, setProducts] = useState<Product[]>([]);
    const navigator = useNavigate();
    const [cookies] = useCookies();

    const loadProducts = async () => {
        // if (signInUser? .userId) {
        //     setUserId(signInUser.userId);
        // }
        const userId = "qwer12345"; // 실제 사용자 ID로 변경해야 돼여

        try {
            const accessToken = cookies[ACCESS_TOKEN]
            const productsData: GetProductListResponseDto | null = await getProductListRequest(userId, accessToken);
            // console.log("API 응답 데이터:", productsData); // 응답 데이터 로그 확인

            if (productsData && 'products' in productsData) {
                const convertedProducts = productsData.products.map(convertProductResponseToProduct);
                setProducts(convertedProducts);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("API 호출 중 오류 발생:", error);
            setProducts([]);
        }
    };

    const onAddButtonClickHandler = () => {
        navigator(MY_PRODUCT_ADD_ABSOLUTE_PATH);
    };

    // const onEditProduct = (productNumber: number) => {
    //     navigator(`${MY_PRODUCT_UPDATE_ABSOLUTE_PATH}/${productNumber}`);
    // };

    const onEditProduct = (productNumber: number) => {
        navigator(`${MY_PRODUCT_UPDATE_ABSOLUTE_PATH.replace(':productNumber', productNumber.toString())}`);
    };

    useEffect(() => {
        loadProducts();
    }, []);    return (
        <div id='manage-product'>
            <div className='title'>상품 관리</div>
            <hr className='custom-hr' />
            <div id='center'>
                <div className='product-box'>
                    <div className='add-button' onClick={onAddButtonClickHandler}>
                        <div className='circle'>+</div>
                        <div className='add-text'>상품 추가</div>
                    </div>
                    {products.map((product) => (
                        <Legacy key={product.productNumber} product={product} onEdit={onEditProduct} />
                    ))}
                </div>
            </div>
        </div>
    );
}
