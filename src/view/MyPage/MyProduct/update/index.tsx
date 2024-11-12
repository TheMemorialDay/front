import React, { useState, ChangeEvent, useRef, KeyboardEvent, useEffect } from 'react';
import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import { fileUploadRequest, getProductRequest, getStoreNumberRequest, patchProductRequest, postProductRequest } from '../../../../apis';
import { PostProductOptionDetailRequestDto, PostProductOptionRequestDto, PostProductRequestDto } from '../../../../apis/dto/request/product';
import { GetProductResponseDto } from '../../../../apis/dto/response/product';
import { PatchProductRequestDto } from '../../../../apis/dto/request/product/patch-product.request.dto';
import { convertUrlToFile } from '../../../../util';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN } from '../../../../constants';
import { useSignInUserStore } from '../../../../stores';
import GetStoreNumber from '../../../../apis/dto/response/product/get-store-number-response.dto';
import { ResponseDto } from '../../../../apis/dto/response';



// variable: 기본 프로필 이미지 URL //
const defaultImageUrl = 'https://blog.kakaocdn.net/dn/4CElL/btrQw18lZMc/Q0oOxqQNdL6kZp0iSKLbV1/img.png';

const defaultProductData: PostProductRequestDto = {
    productImages: [],
    productName: '',
    productIntroduce: '',
    productPrice: 0,
    productToday: false,
    productTag: '',
    options: [],
    themes: []
};

// component: Add 컴포넌트 //
const Add = () => {
    const { productNumber } = useParams<{ productNumber?: string }>();
    //const {storeNumber} = useParams<{storeNumber?: string}>();
    const [storeNumber, setStoreNumber] = useState<string | number>();
    const {signInUser} = useSignInUserStore();
    const [productData, setProductData] = useState<PostProductRequestDto | PatchProductRequestDto>(defaultProductData);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [cookies] = useCookies();
    const navigator = useNavigate();

    useEffect(() => {
        if (productNumber) {
            const loadProduct = async () => {
                try {
                    const accessToken = cookies[ACCESS_TOKEN];
                    if(!accessToken) return;
                    const response = await getProductRequest(productNumber, accessToken);
                    if (response) {
                        const product = response as GetProductResponseDto;
                        const convertedProductData: PatchProductRequestDto = {
                            productImages: product.productImages || [],
                            productName: product.productName,
                            productIntroduce: product.productIntroduce,
                            productPrice: product.productPrice,
                            productToday: product.productToday,
                            productTag: product.productTag,
                            options: product.options || [],
                            themes: product.themes || [],
                        };

                        const files: File[] = [];
                        for (const productImage of product.productImages) {
                            const file = await convertUrlToFile(productImage);
                            files.push(file);
                        }

                        setSelectedFiles(files);
                        setProductData(convertedProductData);
                    }
                } catch (error) {
                    console.error("상품 정보를 불러오는 중 오류 발생:", error);
                }
            };
            loadProduct();
        } else {
            setProductData(defaultProductData);
        }
    }, [productNumber]);

    const onImagesChange = (files: File[]) => {
        const allFiles = [...selectedFiles, ...files].slice(0, 5); // 최대 5장까지 유지
        setSelectedFiles(allFiles);
    };

    const onReset = () => setSelectedFiles([]);

    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setProductData({ ...productData, productName: value });
    };

    const onExplainChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setProductData({ ...productData, productIntroduce: value });
    };

    const onDefaultPriceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const pattern = /^[0-9]+$/;
        if (pattern.test(value)) {
            setProductData({ ...productData, productPrice: Number(value) });
        }
    };

    const selectedOnedayClickHandler = (onedayCheck: boolean) => {
        setProductData({ ...productData, productToday: onedayCheck });
    };

    const onCancleClickHandler = () => {
        navigator('../');
    };

    // 상품 등록 핸들러 수정
    const onRegisterClickHandler = async () => {
    console.log('입력된 데이터:', productData);

    let urls: string[] = [];
    for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        let url = await fileUploadRequest(formData);
        console.log(url);
        if (url) urls.push(url);
        console.log(urls);
    }

    if (!urls.length) {
        alert("사진 등록은 필수입니다.");
        return;
    }

    // 필수 필드 검증
    if (!productData.productName || !productData.productPrice ||
        !urls.length || !productData.options.length || !productData.productTag) {
        alert('모든 필드를 올바르게 입력해주세요.');
        return;
    }

    // 옵션 검증
    for (const option of productData.options) {
        if (!option.productOptionName || !option.optionDetails.length) {
            alert('모든 옵션과 세부사항을 입력해주세요.');
            return;
        }
        for (const detail of option.optionDetails) {
            if (!detail.productCategory || detail.productOptionPrice == null) {
                alert('모든 옵션 세부사항을 입력해주세요.');
                return;
            }
        }
    }

    const requestBody: PostProductRequestDto = {
        productName: productData.productName,
        productIntroduce: productData.productIntroduce,
        productPrice: productData.productPrice,
        productToday: productData.productToday,
        productTag: productData.productTag, // 선택된 태그
        options: productData.options,
        productImages: urls,
        themes: productData.themes, // 선택된 테마
    };

    const patchRequestBody: PatchProductRequestDto = {
        productName: productData.productName,
        productIntroduce: productData.productIntroduce,
        productPrice: productData.productPrice,
        productToday: productData.productToday,
        productTag: productData.productTag, // 선택된 태그
        options: productData.options,
        productImages: urls,
        themes: productData.themes, // 선택된 테마
    };

    // function: get store number response 처리 //
    const getStoreNumberResponse = (responseBody: GetStoreNumber | ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : responseBody.code;
            
        //alert(message);
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if(!isSuccessed) {
            alert(message);
            return;
        }
        const storeNum = responseBody as GetStoreNumber;
        console.log(storeNum.storeNumber);
        setStoreNumber(storeNum.storeNumber);
        //return storeNum.storeNumber;
    }

    

    try {
        let response;
        
        const accessToken = cookies[ACCESS_TOKEN];
        console.log("액세스 토큰: " + accessToken + ", 스토어 넘버: " + storeNumber);
        if(!accessToken) return;
        if (productNumber) {
            // 수정 요청
            response = await patchProductRequest(productNumber, patchRequestBody, accessToken); // 수정 API 호출
        } else {
            // 추가 요청
            // if(signInUser) {
            //     getStoreNumberRequest(signInUser.userId, accessToken).then(getStoreNumberResponse);
            //     if(storeNumber) {
            //         response = await postProductRequest(requestBody, storeNumber, accessToken); // 추가 API 호출
            //     }
            // }
            if (signInUser) {
                const storeNumberResponse = await getStoreNumberRequest(signInUser.userId, accessToken);
                if (storeNumberResponse && storeNumberResponse.code === 'SU') {
                    const storeNum = storeNumberResponse as GetStoreNumber;
                    console.log("스토어 넘버:", storeNum.storeNumber);
                    setStoreNumber(storeNum.storeNumber); // 스토어 번호 설정

                    // 설정된 storeNumber를 사용해 상품 등록 API 호출
                    response = await postProductRequest(requestBody, storeNum.storeNumber, accessToken);
                } else {
                    alert(storeNumberResponse?.message || '스토어 번호를 가져오는 중 문제가 발생했습니다.');
                    return;
                }
            }
            
        }
        console.log('상품 등록/수정 성공:', response);
        navigator('../');
    } catch (error) {
        console.error('상품 등록/수정 실패:', error);
        alert('상품 등록/수정에 실패했습니다.');
    }
};


    return (
        <div id='add-product'>
            <div className='title'>상품 관리</div>
            <hr className='custom-hr' />

            <Pictures files={selectedFiles} onImagesChange={onImagesChange} onReset={onReset} />
            
            <div className='product-info'>
                <input className='product-name' placeholder='메뉴 이름' value={productData.productName} onChange={onNameChangeHandler} />
                <textarea className='product-explain' placeholder='메뉴 설명' value={productData.productIntroduce} onChange={onExplainChangeHandler} />
                <input className='product-price' type='text' placeholder='메뉴 최소 가격 (ex: 30000)' value={productData.productPrice || ''} onChange={onDefaultPriceChangeHandler} />

                <div className='oneday-cake'>
                    <div onClick={() => { selectedOnedayClickHandler(true) }} className={productData.productToday ? 'possible' : 'impossible'}>당일 케이크 가능</div>
                    <div onClick={() => { selectedOnedayClickHandler(false) }} className={!productData.productToday ? 'possible' : 'impossible'}>당일 케이크 불가능</div>
                </div>

                <div style={{ fontSize: "20px", fontWeight: "700", marginTop: "30px" }}>
                    케이크 종류를 하나 선택해 주세요.
                </div>
                <ProductThema product={productData} onTagChange={(tag) => setProductData({ ...productData, productTag: tag })} />
                <SizeOption product={productData} onOptionsChange={(options) => setProductData({ ...productData, options })} />
                <FlavorOption product={productData} onOptionsChange={(options) => setProductData({ ...productData, options })} />
                <OptionList product={productData} onOptionsChange={(options) => setProductData({ ...productData, options })} />
                <ProductTags product={productData} onTagsChange={(tags) => setProductData({ ...productData, themes: tags })} />
            </div>

            <div className='button-box'>
                <div className='button-cancle' onClick={onCancleClickHandler}>취소</div>
                <div className='button-register' onClick={onRegisterClickHandler}>등록</div>
            </div>
        </div>
    );
};

// component:  Pictures 컴포넌트 //
interface PicturesProps {
    files: File[];
    onImagesChange: (files: File[]) => void;
    onReset: () => void;
}

// component: 이미지 등록 컴포넌트 //
const Pictures = ({ files, onImagesChange, onReset }: PicturesProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openFileDialog = () => {
        const { current } = fileInputRef;
        if (!current) return;
        current.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (!files) return;
        onImagesChange(Array.from(files));
    };

    return (
        <div>
            <div className='arrange'>
                <div className='notice' style={{ textAlign: "left" }}>* 첫 번째 사진은 대표 사진입니다.</div>
                <div className='remove-pics' onClick={onReset}>초기화</div>
            </div>

            <div className='images-box'>
                <div className='add-button' onClick={openFileDialog}>
                    <div className='circle'>+</div>
                    <div className='add-text'>사진 추가</div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

                <div className='images-box'>
                    {files.map((file, index) => (
                        <div key={index} className='legacy-product'
                            style={{ backgroundImage: `url(${URL.createObjectURL(file)})`, backgroundSize: "cover" }} />
                    ))}
                </div>
            </div>
        </div>
    );
};


// component: SizeOption 컴포넌트 //
const SizeOption = ({ product, onOptionsChange }: { product: PostProductRequestDto; onOptionsChange: (options: PostProductOptionRequestDto[]) => void }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [showInput, setShowInput] = useState<boolean>(false);
    const [additionalPrice, setAdditionalPrice] = useState<string>('');

    const handlePlusButtonClick = () => {
        setShowInput(true);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const onAdditionalPriceHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setAdditionalPrice(event.target.value);
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
            const newOption: PostProductOptionRequestDto = {
                productOptionName: '크기',
                optionDetails: [{
                    productCategory: inputValue,
                    productOptionPrice: Number(additionalPrice) || 0
                }]
            };

            // '크기' 옵션에 새 세부 사항 추가
            const updatedOptions = product.options.map(option => {
                if (option.productOptionName === '크기') {
                    return {
                        ...option,
                        optionDetails: [...option.optionDetails, ...newOption.optionDetails]
                    };
                }
                return option;
            });

            // '크기' 옵션이 없으면 새로 추가
            if (!updatedOptions.find(option => option.productOptionName === '크기')) {
                updatedOptions.push(newOption);
            }

            onOptionsChange(updatedOptions); // 상위 컴포넌트에 옵션 전달
            setInputValue('');
            setAdditionalPrice('');
            setShowInput(false);
        }
    };

    const handleRemoveButtonClick = (indexToRemove: number) => {
        const updatedOptions = product.options.map(option => {
            if (option.productOptionName === '크기') {
                return {
                    ...option,
                    optionDetails: option.optionDetails.filter((_, index) => index !== indexToRemove) // 해당 세부 사항만 삭제
                };
            }
            return option;
        });
        onOptionsChange(updatedOptions); // 상위 컴포넌트에 업데이트된 옵션 전달
    };

    return (
        <div className='option-box'>크기
                    {showInput && (
                        <div style={{marginTop: "10px", marginBottom:"10px"}}>
                            <input
                                className='cake-size'
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                placeholder="크기 입력"
                                autoFocus
                            />
                            <input
                                className='cake-size-price'
                                type="text"
                                value={additionalPrice}
                                onChange={onAdditionalPriceHandler}
                                onKeyPress={handleKeyPress}
                                placeholder="추가 금액(ex: 5000) 없으면 0, 입력 후 엔터"
                            />
                        </div>
                    )}
            <div className='radio-handler'>
                <div className='detail-text' style={{ marginTop: '10px' }}>
                    {product.options.filter(item => item.productOptionName === "크기").map((option, optionIndex) => (
                        option.optionDetails.map((detail, detailIndex) => (
                            <div key={`${optionIndex}-${detailIndex}`} style={{ display: "flex", flexDirection: "row", padding: "5px"}}>
                                <div className='xx-sign' onClick={() => handleRemoveButtonClick(detailIndex)}>x</div>
                                <input type="radio" id={`radio-${optionIndex}-${detailIndex}`} name="radioGroup" value={option.productOptionName} disabled />
                                <label htmlFor={`radio-${optionIndex}-${detailIndex}`} style={{ marginLeft: "5px" }}>
                                    {detail.productCategory} (+{detail.productOptionPrice}원)
                                </label>
                            </div>
                        ))
                    ))}
                </div>
                <div className='plus-button' onClick={handlePlusButtonClick}>추가</div>
            </div>
        </div>
    );
};

// component: FlavorOption 컴포넌트 //
const FlavorOption = ({ product, onOptionsChange }: { product: PostProductRequestDto; onOptionsChange: (options: PostProductOptionRequestDto[]) => void }) => {
    const [inputFlavorValue, setInputFlavorValue] = useState<string>('');
    const [showFlavorInput, setShowFlavorInput] = useState<boolean>(false);
    const [flavorAdditionalPrice, setFlavorAddtionalPrice] = useState<string>('');

    const handleFlavorPlusButtonClick = () => {
        setShowFlavorInput(true);
    };

    const handleFlavorInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputFlavorValue(event.target.value);
    };

    const flavorPriceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setFlavorAddtionalPrice(event.target.value);
    };

    const handleFlavorKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputFlavorValue.trim() !== '') {
            const newFlavor: PostProductOptionRequestDto = {
                productOptionName: '맛',
                optionDetails: [{
                    productCategory: inputFlavorValue,
                    productOptionPrice: Number(flavorAdditionalPrice) || 0
                }]
            };

            // '맛' 옵션에 새 세부 사항 추가
            const updatedFlavors = product.options.map(option => {
                if (option.productOptionName === '맛') {
                    return {
                        ...option,
                        optionDetails: [...option.optionDetails, ...newFlavor.optionDetails]
                    };
                }
                return option;
            });

            // '맛' 옵션이 없으면 새로 추가
            if (!updatedFlavors.find(option => option.productOptionName === '맛')) {
                updatedFlavors.push(newFlavor);
            }

            onOptionsChange(updatedFlavors); // 상위 컴포넌트에 옵션 전달
            setInputFlavorValue('');
            setFlavorAddtionalPrice('');
            setShowFlavorInput(false);
        }
    };

    const handleRemoveButtonClick = (indexToRemove: number) => {
        const updatedButtons = product.options.map(option => {
            if (option.productOptionName === '맛') {
                return {
                    ...option,
                    optionDetails: option.optionDetails.filter((_, index) => index !== indexToRemove) // 해당 세부 사항만 삭제
                };
            }
            return option;
        });
        onOptionsChange(updatedButtons); // 상위 컴포넌트에 업데이트된 옵션 전달
    };

    return (
        <div className='option-box'>맛
            {showFlavorInput && (
                <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                    <input
                        className='cake-size'
                        type="text"
                        value={inputFlavorValue}
                        onChange={handleFlavorInputChange}
                        placeholder="맛 입력"
                        autoFocus
                    />
                    <input
                        className='cake-size-price'
                        type="text"
                        value={flavorAdditionalPrice}
                        onChange={flavorPriceChangeHandler}
                        onKeyPress={handleFlavorKeyPress}
                        placeholder="추가 금액(ex: 5000) 없으면 0, 입력 후 엔터"
                    />
                </div>
            )}
            <div className='radio-handler'>
                <div className='detail-text' style={{ marginTop: '10px' }}>
                    {product.options.filter(item => item.productOptionName === "맛").map((option, optionIndex) => (
                        option.optionDetails.map((detail, detailIndex) => (
                            <div key={`${optionIndex}-${detailIndex}`} style={{ display: "flex", flexDirection: "row", padding: "5px" }}>
                                <div className='xx-sign' onClick={() => handleRemoveButtonClick(detailIndex)}>x</div>
                                <input type="radio" id={`flavor-radio-${optionIndex}-${detailIndex}`} name="flavorGroup" value={option.productOptionName} disabled />
                                <label htmlFor={`flavor-radio-${optionIndex}-${detailIndex}`} style={{ marginLeft: "5px" }}>
                                    {detail.productCategory} (+{detail.productOptionPrice}원)
                                </label>
                            </div>
                        ))
                    ))}
                </div>
                <div className='plus-button' onClick={handleFlavorPlusButtonClick}>추가</div>
            </div>
        </div>
    );
};


// component: OptionList 컴포넌트 //
const OptionList = ({ product, onOptionsChange }: { product: PostProductRequestDto; onOptionsChange: (options: PostProductOptionRequestDto[]) => void }) => {
    const [optionComponents, setOptionComponents] = useState<{ name: string; details: PostProductOptionDetailRequestDto[] }[]>([]);

    useEffect(() => {
        const filteredOptions = product.options
            .filter(option => option.productOptionName !== '맛' && option.productOptionName !== '크기')
            .map(option => ({
                name: option.productOptionName,
                details: option.optionDetails
            }));

        const uniqueOptions = Array.from(new Set(filteredOptions.map(option => option.name)))
            .map(name => filteredOptions.find(option => option.name === name))
            .filter((option): option is { name: string; details: PostProductOptionDetailRequestDto[] } => option !== undefined);

        setOptionComponents(uniqueOptions);
    }, [product.options]);

    const handleAddNewOption = () => {
        if (optionComponents.length < 3) {
            setOptionComponents([...optionComponents, { name: '', details: [] }]);
        } else {
            alert('옵션은 최대 3개까지만 추가할 수 있습니다.');
        }
    };

    return (
        <div style={{width: "100%", marginLeft: "-40px"}}>
            {optionComponents.map((option, index) => (
                <NewOption
                    key={index}
                    product={product}
                    onOptionsChange={onOptionsChange}
                    option={option}
                    setOptionName={(name: string) => {
                        const updatedOptions = [...optionComponents];
                        updatedOptions[index].name = name;
                        setOptionComponents(updatedOptions);
                    }}
                    removeOption={() => {
                        const updatedOptions = optionComponents.filter((_, i) => i !== index);
                        setOptionComponents(updatedOptions);
                        onOptionsChange([
                            ...product.options.filter(opt => opt.productOptionName === '맛' || opt.productOptionName === '크기'),
                            ...updatedOptions.map(opt => ({ productOptionName: opt.name, optionDetails: opt.details })),
                        ]);
                    }}
                    addDetail={(category: string, price: number) => {
                        const updatedOptions = [...optionComponents];
                        updatedOptions[index].details.push({ productCategory: category, productOptionPrice: price });
                        setOptionComponents(updatedOptions);
                        onOptionsChange([
                            ...product.options.filter(opt => opt.productOptionName === '맛' || opt.productOptionName === '크기'),
                            ...updatedOptions.map(opt => ({ productOptionName: opt.name, optionDetails: opt.details })),
                        ]);
                    }}
                    removeDetail={(detailIndex: number) => {
                        const updatedOptions = [...optionComponents];
                        updatedOptions[index].details.splice(detailIndex, 1);
                        setOptionComponents(updatedOptions);
                        onOptionsChange([
                            ...product.options.filter(opt => opt.productOptionName === '맛' || opt.productOptionName === '크기'),
                            ...updatedOptions.map(opt => ({ productOptionName: opt.name, optionDetails: opt.details })),
                        ]);
                    }}
                />
            ))}
            <div className='option-add-box'>
                <div className='plus-button-option' onClick={handleAddNewOption}>옵션 추가</div>
            </div>
        </div>
    );
};

// component: NewOption 컴포넌트 //
const NewOption = ({ product, onOptionsChange, option, setOptionName, removeOption, addDetail, removeDetail }: {
    product: PostProductRequestDto,
    onOptionsChange: (options: PostProductOptionRequestDto[]) => void,
    option: { name: string; details: PostProductOptionDetailRequestDto[] },
    setOptionName: (name: string) => void,
    removeOption: () => void,
    addDetail: (category: string, price: number) => void,
    removeDetail: (detailIndex: number) => void
}) => {
    const [showInput, setShowInput] = useState<boolean>(false);
    const [inputDetailValue, setInputDetailValue] = useState<string>(''); // 카테고리
    const [newOptionAdditionalPrice, setNewOptionAdditionalPrice] = useState<string>(''); // 추가 금액
    const [isNameFixed, setIsNameFixed] = useState<boolean>(false);

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!isNameFixed) {
            setOptionName(event.target.value);
        }
    };

    const handleKeyPressForName = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && option.name.trim() !== '') {
            setIsNameFixed(true);
        }
    };

    const handleKeyPressForDetail = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputDetailValue.trim() !== '') {
            const price = Number(newOptionAdditionalPrice) || 0;
            addDetail(inputDetailValue, price);
            setInputDetailValue('');
            setNewOptionAdditionalPrice('');
            setShowInput(false);
        }
    };

    return (
        <div className='option-box' style={{ marginBottom: "20px", minHeight: 'auto'}}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <input
                    className='new-option-name'
                    placeholder='옵션명 입력 (ex: 색상, 초 등)'
                    value={option.name}
                    onChange={handleNameChange}
                    onKeyPress={handleKeyPressForName}
                    disabled={isNameFixed}
                />
                <div className='xx-sign' onClick={removeOption} style={{marginRight: "8px"}}>X</div>
            </div>

            {showInput && (
                <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                    <input
                        className='cake-size'
                        type='text'
                        placeholder='카테고리 입력'
                        value={inputDetailValue}
                        onChange={(e) => setInputDetailValue(e.target.value)}
                        onKeyPress={handleKeyPressForDetail}
                        autoFocus
                    />
                    <input
                        className='cake-size-price'
                        type='text'
                        placeholder='추가 금액(ex: 5000) 없으면 0, 입력 후 엔터'
                        value={newOptionAdditionalPrice}
                        onChange={(e) => setNewOptionAdditionalPrice(e.target.value)}
                        onKeyPress={handleKeyPressForDetail}
                    />
                </div>
            )}

            <div className='radio-handler'>
                <div className='detail-text'>
                    {option.details.map((detail, detailIndex) => (
                        <div key={detailIndex} style={{ display: "flex", flexDirection: "row", padding: "5px" }}>
                            <div className='xx-sign' onClick={() => removeDetail(detailIndex)}>x</div>
                            <input type="radio" id={`radio-${detailIndex}`} name="radioGroup" value={detail.productCategory} disabled />
                            <label htmlFor={`radio-${detailIndex}`} style={{ marginLeft: "5px" }}>
                                {detail.productCategory} (+{detail.productOptionPrice}원)
                            </label>
                        </div>
                    ))}
                </div>
                <div className='plus-button' onClick={() => setShowInput(true)}>추가</div>
            </div>
        </div>
    );
};


// component: ProductTags 컴포넌트 //
const ProductTags = ({ product, onTagsChange }: { product: PostProductRequestDto, onTagsChange: (tags: string[]) => void }) => {
    
    const handleTagClick = (tag: string) => {
        if (!product.themes.includes(tag) && product.themes.length < 5) {
            const updatedTags = [...product.themes, tag];
            onTagsChange(updatedTags); // 상위 컴포넌트에 업데이트된 태그 전달
        } else if (product.themes.length >= 5) {
            alert('상품 테마는 최대 5개까지만 선택할 수 있습니다.');
        }
    };

    const handleTagRemove = (tag: string) => {
        const updatedTags = product.themes.filter((selectedTag) => selectedTag !== tag);
        onTagsChange(updatedTags); // 상위 컴포넌트에 업데이트된 태그 전달
    };

    return (
        <div className='tag-select'>
            <div className='tag-chunks'>
                <div className='five'>
                    <div onClick={() => { handleTagClick('#심플') }}>
                        <Tags content='#심플' />
                    </div>
                    <div onClick={() => { handleTagClick('#화려함') }}>
                        <Tags content='#화려함' />
                    </div>
                    <div onClick={() => { handleTagClick('#펑키') }}>
                        <Tags content='#펑키' />
                    </div>
                    <div onClick={() => { handleTagClick('#크리스마스') }}>
                        <Tags content='#크리스마스' />
                    </div>
                    <div onClick={() => { handleTagClick('#아이돌') }}>
                        <Tags content='#아이돌' />
                    </div>
                </div>
                <div className='five'>
                    <div onClick={() => { handleTagClick('#졸업') }}>
                        <Tags content='#졸업' />
                    </div>
                    <div onClick={() => { handleTagClick('#귀여움') }}>
                        <Tags content='#귀여움' />
                    </div>
                    <div onClick={() => { handleTagClick('#러블리') }}>
                        <Tags content='#러블리' />
                    </div>
                    <div onClick={() => { handleTagClick('#재미') }}>
                        <Tags content='#재미' />
                    </div>
                    <div onClick={() => { handleTagClick('#할로윈') }}>
                        <Tags content='#할로윈' />
                    </div>
                </div>
                <div className='five'>
                    <div onClick={() => { handleTagClick('#신년') }}>
                        <Tags content='#신년' />
                    </div>
                    <div onClick={() => { handleTagClick('#효도') }}>
                        <Tags content='#효도' />
                    </div>
                    <div onClick={() => { handleTagClick('#연인') }}>
                        <Tags content='#연인' />
                    </div>
                    <div onClick={() => { handleTagClick('#어린이') }}>
                        <Tags content='#어린이' />
                    </div>
                    <div onClick={() => { handleTagClick('#웨딩') }}>
                        <Tags content='#웨딩' />
                    </div>
                    <div onClick={() => { handleTagClick('#취업/승진') }}>
                        <Tags content='#취업/승진' />
                    </div>
                </div>
            </div>
            <div className='selected-tags'>
                {product.themes.length === 0 ? '상품 테마 최대 5개 선택' :
                    <div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            {product.themes.map(tag => (
                                <SelectedTags key={tag} content={tag} onRemove={() => handleTagRemove(tag)} />
                            ))}
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

// component: Tags 컴포넌트 //
const Tags = ({ content }: { content: string }) => {
    return (
        <div id='tags'>{content}</div>
    );
};

// component: SelectedTags 컴포넌트 //
const SelectedTags = ({ content, onRemove }: { content: string; onRemove: () => void }) => {
    return (
        <div className='no-select'>
            <div className='x-sign' onClick={onRemove}>X</div>
            <div id='tags'>{content}</div>
        </div>
    );
};

// component: ProductThema 컴포넌트 //
const ProductThema = ({ product, onTagChange }: { product: PostProductRequestDto, onTagChange: (tag: string) => void }) => {
    
    const onTagClickHandler = (tag: string) => {
        onTagChange(tag); // 상위 컴포넌트에 선택된 태그 전달
    };

    return (
        <div className='store-filter' style={{ marginBottom: "30px" }}>
            <div className='filter-box' >
                <CakeComponent imageUrl="/photo.png" context="포토" isSelected={product.productTag === "포토"} onClick={() => onTagClickHandler("포토")} />
                <CakeComponent imageUrl="/abc.png" context="레터링" isSelected={product.productTag === "레터링"} onClick={() => onTagClickHandler("레터링")} />
                <CakeComponent imageUrl="/piece.png" context="한입 케이크" isSelected={product.productTag === "한입 케이크"} onClick={() => onTagClickHandler("한입 케이크")} />
                <CakeComponent imageUrl="/box.png" context="도시락 케이크" isSelected={product.productTag === "도시락 케이크"} onClick={() => onTagClickHandler("도시락 케이크")} />
                <CakeComponent imageUrl="/level.png" context="이단 케이크" isSelected={product.productTag === "이단 케이크"} onClick={() => onTagClickHandler("이단 케이크")} />
                <CakeComponent imageUrl="/leaf.png" context="비건 케이크" isSelected={product.productTag === "비건 케이크"} onClick={() => onTagClickHandler("비건 케이크")} />
                <CakeComponent imageUrl="/ricecake_final.png" context="떡 케이크" isSelected={product.productTag === "떡 케이크"} onClick={() => onTagClickHandler("떡 케이크")} />
            </div>
        </div>
    );
};


// component: CakeComponent 컴포넌트 //
interface CakeComponentProps {
    imageUrl: string;
    context: string;
    isSelected: boolean;
    onClick: () => void;
}

// component: 케이크 태그 컴포넌트 //
const CakeComponent = ({ imageUrl, context, isSelected, onClick }: CakeComponentProps) => {
    return (
        <div className='filter-cake' onClick={onClick}
            style={{
                cursor: "pointer", userSelect: "none",
                backgroundColor: isSelected ? 'rgba(211, 211, 211, 0.3)' : 'transparent',
                padding: "15px", margin: "-4px"
            }}>
            <div className='circle-box'>
                <div className='circle' style={{ backgroundImage: `url(${imageUrl})` }}></div>
            </div>
            <div className='context' style={{ fontSize: "18px" }}>{context}</div>
        </div>
    );
};

const Update = () => {
    return (
        <Add />
    );
};

export default Update;