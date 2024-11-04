import React, { useEffect, useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, MY_PRODUCT_ADD_ABSOLUTE_PATH, MY_PRODUCT_UPDATE_ABSOLUTE_PATH } from '../../../constants';
import { deleteProductRequest, getProductListRequest } from '../../../apis';
import { Product } from '../../../types';
import { GetProductListResponseDto } from '../../../apis/dto/response/product';
import { ProductResponse } from '../../../apis/dto/response/product/get-product-list-response.dto';
import { useSignInUserStore } from '../../../stores';
import { useCookies } from 'react-cookie';
import { ResponseDto } from '../../../apis/dto/response';

const defaultProfileImageUrl = 'https://blog.kakaocdn.net/dn/4CElL/btrQw18lZMc/Q0oOxqQNdL6kZp0iSKLbV1/img.png';

// component: 기존 상품 박스 컴포넌트
function Legacy({ product, onEdit, getProductList }: { product: Product; onEdit: (productNumber: number) => void; getProductList: () => void; }) {

    
    // state: cookie 상태 //
    const [cookies] = useCookies();

    // function: delete product response 처리 함수 //
    const deleteProductResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '잘못된 접근입니다.' :
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                        responseBody.code === 'NT' ? '존재하지 않는 용품입니다.' :
                            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        getProductList();
    };

    const onDeleteButtonClickHandler = (event: React.MouseEvent) => {
        event.stopPropagation();
        const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
        if(!isConfirm) return false;
        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken) return;
        deleteProductRequest(product.productNumber, accessToken).then(deleteProductResponse);
    };

    return (
        <div className='legacy-product' onClick={() => onEdit(product.productNumber)}
                    style={{
                        backgroundImage: `url(${product.productImageUrl || defaultProfileImageUrl})`,
                    }}
                >
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
    const {signInUser} = useSignInUserStore();
    const [userId, setUserId] = useState<string>('');
    const [cookies] = useCookies();

    const loadProducts = async () => {    
        

        try {
            const accessToken = cookies[ACCESS_TOKEN];
            if (!userId || !accessToken) return;
            
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
        if (signInUser?.userId) {
            setUserId(signInUser.userId);
        }
    }, [signInUser?.userId]); 

    useEffect(() => {
        loadProducts();
    }, [userId, cookies]);    
    
    return (
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
                        <Legacy 
                            key={product.productNumber} 
                            product={product} 
                            onEdit={onEditProduct} 
                            getProductList={loadProducts} // loadProducts 함수 전달
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
