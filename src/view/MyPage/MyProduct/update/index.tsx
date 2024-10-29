import React, { useState, ChangeEvent, useRef, KeyboardEvent, useEffect } from 'react';
import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import { fileUploadRequest, getProductRequest, postProductRequest } from '../../../../apis';
import { PostProductOptionRequestDto } from '../../../../apis/dto/request/product';
import { GetProductResponseDto } from '../../../../apis/dto/response/product';



// variable: 기본 프로필 이미지 URL //
const defaultImageUrl = 'https://blog.kakaocdn.net/dn/4CElL/btrQw18lZMc/Q0oOxqQNdL6kZp0iSKLbV1/img.png';

// DTO 정의
export interface PostProductRequestDto {
    productImages: string[];
    productName: string;
    productIntroduce: string;
    productPrice: number;
    productToday: boolean;
    productTag: string;
    options: PostProductOptionRequestDto[];
    themes: string[];
}

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
    const [productData, setProductData] = useState<PostProductRequestDto>(defaultProductData);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const navigator = useNavigate();

    useEffect(() => {
        if (productNumber) {
            const loadProduct = async () => {
                try {
                    const response = await getProductRequest(productNumber);
                    if (response) {
                        const product = response as GetProductResponseDto;
                        const convertedProductData: PostProductRequestDto = {
                            productImages: product.productImages || [],
                            productName: product.productName,
                            productIntroduce: product.productIntroduce,
                            productPrice: product.productPrice,
                            productToday: product.productToday,
                            productTag: product.productTag,
                            options: product.options || [],
                            themes: product.themes || [],
                        };

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
        // navigator('../');
    };

// 상품 등록 핸들러 수정
const onRegisterClickHandler = async () => {
    console.log('입력된 데이터:', productData);

    const urls: string[] = [];
    for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        const url = await fileUploadRequest(formData);
        if (url) urls.push(url);
    }

    if (!urls.length) urls.push(defaultImageUrl);

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

    try {
        const response = await postProductRequest(requestBody); // requestBody로 수정
        console.log('상품 등록 성공:', response);
        navigator('../');
    } catch (error) {
        console.error('상품 등록 실패:', error);
        alert('상품 등록에 실패했습니다.');
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
                <input className='product-price' type='number' placeholder='메뉴 최소 가격 (ex: 30000)' value={productData.productPrice || ''} onChange={onDefaultPriceChangeHandler} />

                <div className='oneday-cake'>
                    <div onClick={() => { selectedOnedayClickHandler(true) }} className={productData.productToday ? 'possible' : 'impossible'}>당일 케이크 가능</div>
                    <div onClick={() => { selectedOnedayClickHandler(false) }} className={!productData.productToday ? 'possible' : 'impossible'}>당일 케이크 불가능</div>
                </div>

                <div style={{ fontSize: "20px", fontWeight: "700", marginTop: "30px" }}>
                    케이크 종류를 하나 선택해 주세요.
                </div>
                <ProductThema onTagChange={(tag) => setProductData({ ...productData, productTag: tag })} />
                <SizeOption onOptionsChange={(options) => setProductData({ ...productData, options })} />
                <FlavorOption onOptionsChange={(options) => setProductData({ ...productData, options })} />
                <OptionList onOptionsChange={(options) => setProductData({ ...productData, options })} />
                <ProductTags onTagsChange={(tags) => setProductData({ ...productData, themes: tags })} />
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
const SizeOption = ({ onOptionsChange }: { onOptionsChange: (options: PostProductOptionRequestDto[]) => void }) => {
    const [options, setOptions] = useState<PostProductOptionRequestDto[]>([]);
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
            const updatedOptions = [...options, newOption];
            setOptions(updatedOptions);
            onOptionsChange(updatedOptions); // 상위 컴포넌트에 옵션 전달
            setInputValue('');
            setAdditionalPrice('');
            setShowInput(false);
        }
    };

    const handleRemoveButtonClick = (indexToRemove: number) => {
        const updatedButtons = options.filter((_, index) => index !== indexToRemove);
        setOptions(updatedButtons);
        onOptionsChange(updatedButtons); // 상위 컴포넌트에 업데이트된 옵션 전달
    };

    return (
        <div className='option-box'>크기
            <div className='radio-handler'>
                <div className='detail-text'>
                    {showInput && (
                        <div>
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

                    {options.map((option, index) => (
                        <div key={index} style={{ display: "flex", flexDirection: "row", marginRight: "20px" }}>
                            <div className='xx-sign' onClick={() => handleRemoveButtonClick(index)}>X</div>
                            <input type="radio" id={`radio-${index}`} name="radioGroup" value={option.productOptionName} disabled />
                            <label htmlFor={`radio-${index}`} style={{ marginLeft: "5px" }}>
                                {option.optionDetails[0].productCategory} (+{option.optionDetails[0].productOptionPrice}원)
                            </label>
                        </div>
                    ))}
                </div>
                <div className='plus-button' onClick={handlePlusButtonClick}>추가</div>
            </div>
        </div>
    );
};

// component: FlavorOption 컴포넌트 //
const FlavorOption = ({ onOptionsChange }: { onOptionsChange: (options: PostProductOptionRequestDto[]) => void }) => {
    const [options, setOptions] = useState<PostProductOptionRequestDto[]>([]);
    const [inputFlavorValue, setInputFlavorValue] = useState<string>('');
    const [showFlavorInput, setShowFlavorInput] = useState<boolean>(false);
    const [flavorAdditionalPrice, setFlavorAddtionalPrice] = useState<string>('');

    const handleFlavorPlusButtonClick = () => {
        setShowFlavorInput(true);
    };

    const handleFlavorInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setInputFlavorValue(value);
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
            const updatedFlavors = [...options, newFlavor];
            setOptions(updatedFlavors);
            onOptionsChange(updatedFlavors); // 상위 컴포넌트에 옵션 전달
            setInputFlavorValue('');
            setFlavorAddtionalPrice('');
            setShowFlavorInput(false);
        }
    };

    const handleRemoveButtonClick = (indexToRemove: number) => {
        const updatedButtons = options.filter((_, index) => index !== indexToRemove);
        setOptions(updatedButtons);
        onOptionsChange(updatedButtons); // 상위 컴포넌트에 업데이트된 옵션 전달
    };

    return (
        <div className='option-box'>맛
            <div className='radio-handler'>
                <div className='detail-text'>
                    {showFlavorInput && (
                        <div>
                            <input
                                className='cake-flavor'
                                type="text"
                                value={inputFlavorValue}
                                onChange={handleFlavorInputChange}
                                placeholder="맛 입력"
                                autoFocus
                            />
                            <input
                                className='cake-flavor-price'
                                type="text"
                                value={flavorAdditionalPrice}
                                onChange={flavorPriceChangeHandler}
                                onKeyPress={handleFlavorKeyPress}
                                placeholder="추가 금액(ex: 5000) 없으면 0, 입력 후 엔터"
                            />
                        </div>
                    )}

                    {options.map((option, index) => (
                        <div key={index} style={{ display: "flex", flexDirection: "row", marginRight: "20px" }}>
                            <div className='xx-sign' onClick={() => handleRemoveButtonClick(index)}>X</div>
                            <input type="radio" id={`flavor-radio-${index}`} name="flavorGroup" value={option.productOptionName} disabled />
                            <label htmlFor={`flavor-radio-${index}`} style={{ marginLeft: "5px" }}>
                                {option.optionDetails[0].productCategory} (+{option.optionDetails[0].productOptionPrice}원)
                            </label>
                        </div>
                    ))}
                </div>
                <div className='plus-button' onClick={handleFlavorPlusButtonClick}>추가</div>
            </div>
        </div>
    );
};

// component: OptionList 컴포넌트 //
const OptionList = ({ onOptionsChange }: { onOptionsChange: (options: PostProductOptionRequestDto[]) => void }) => {
    const [optionComponents, setOptionComponents] = useState<number[]>([]);

    const handleAddNewOption = () => {
        if (optionComponents.length < 3) {
            setOptionComponents([...optionComponents, optionComponents.length + 1]);
        } else {
            alert('옵션은 최대 3개까지만 추가할 수 있습니다.');
        }
    };

    return (
        <div>
            <div>{optionComponents.map((_, index) => (
                <NewOption key={index} onOptionsChange={onOptionsChange} />
            ))}</div>
            <div className='option-add-box'>
                <div className='plus-button-option' onClick={handleAddNewOption}>옵션 추가</div>
            </div>
        </div>
    );
};

// component: NewOption 컴포넌트 //
const NewOption = ({ onOptionsChange }: { onOptionsChange: (options: PostProductOptionRequestDto[]) => void }) => {
    const [newInputValue, setNewInputValue] = useState<string>('');
    const [inputDetailValue, setInputDetailValue] = useState<string>('');
    const [newOptions, setNewOptions] = useState<PostProductOptionRequestDto[]>([]);
    const [newOptionAdditionalPrice, setNewOptionAdditionalPrice] = useState<string>('');   

    const onChangeNewOptionHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setNewInputValue(event.target.value);
    };

    const onNewOptionDetailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setInputDetailValue(event.target.value);
    };

    const onNewOptionAdditionalPriceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setNewOptionAdditionalPrice(event.target.value);
    };

    const onNewOptionDetailKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputDetailValue.trim() !== '') {
            const newOption = {
                productOptionName: newInputValue,
                optionDetails: [{ productCategory: inputDetailValue, productOptionPrice: Number(newOptionAdditionalPrice) || 0 }]
            };
            const updatedOptions = [...newOptions, newOption];
            setNewOptions(updatedOptions);
            onOptionsChange(updatedOptions); // 상위 컴포넌트에 옵션 전달
            setInputDetailValue('');
            setNewOptionAdditionalPrice('');
        }
    };

    const handleRemoveButtonClick = (indexToRemove: number) => {
        const updatedOptions = newOptions.filter((_, index) => index !== indexToRemove);
        setNewOptions(updatedOptions);
        onOptionsChange(updatedOptions); // 상위 컴포넌트에 업데이트된 옵션 전달
    };

    return (
        <div className='option-box' style={{ marginBottom: "20px" }}>
            <input className='new-option-name' placeholder='옵션을 입력하세요.(ex: 색상)' onKeyPress={onNewOptionDetailKeyPressHandler} 
                onChange={onChangeNewOptionHandler} />

            <div className='radio-handler'>
                <div className='detail-text'>
                    {newOptions.map((button, index) => (
                        <div key={index} style={{ display: "flex", flexDirection: "row", marginRight: "20px" }}>
                            <div className='xx-sign' onClick={() => handleRemoveButtonClick(index)}>X</div>
                            <input type="radio" id={`new-option-radio-${index}`} name="newOptionGroup" value={button.productOptionName} disabled />
                            <label htmlFor={`new-option-radio-${index}`} style={{ marginLeft: "5px" }}>
                                {button.productOptionName} (+{button.optionDetails[0].productOptionPrice}원)
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// component: ProductTags 컴포넌트 //
const ProductTags = ({ onTagsChange }: { onTagsChange: (tags: string[]) => void }) => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleTagClick = (tag: string) => {
        if (!selectedTags.includes(tag) && selectedTags.length < 5) {
            const updatedTags = [...selectedTags, tag];
            setSelectedTags(updatedTags);
            onTagsChange(updatedTags); // 상위 컴포넌트에 업데이트된 태그 전달
        } else if (selectedTags.length >= 5) {
            alert('상품 테마는 최대 5개까지만 선택할 수 있습니다.');
        }
    };

    const handleTagRemove = (tag: string) => {
        const updatedTags = selectedTags.filter((selectedTag) => selectedTag !== tag);
        setSelectedTags(updatedTags);
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
                {selectedTags.length === 0 ? '상품 테마 최대 5개 선택' :
                    <div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            {selectedTags.map(tag => (
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
const ProductThema = ({ onTagChange }: { onTagChange: (tag: string) => void }) => {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const onTagClickHandler = (tag: string) => {
        setSelectedTag(tag);
        onTagChange(tag); // 상위 컴포넌트에 선택된 태그 전달
    };

    return (
        <div className='store-filter' style={{ marginBottom: "30px" }}>
            <div className='filter-box' >
                <CakeComponent imageUrl="/photo.png" context="포토" isSelected={selectedTag === "포토"} onClick={() => onTagClickHandler("포토")} />
                <CakeComponent imageUrl="/abc.png" context="레터링" isSelected={selectedTag === "레터링"} onClick={() => onTagClickHandler("레터링")} />
                <CakeComponent imageUrl="/piece.png" context="한입 케이크" isSelected={selectedTag === "한입 케이크"} onClick={() => onTagClickHandler("한입 케이크")} />
                <CakeComponent imageUrl="/box.png" context="도시락 케이크" isSelected={selectedTag === "도시락 케이크"} onClick={() => onTagClickHandler("도시락 케이크")} />
                <CakeComponent imageUrl="/level.png" context="이단 케이크" isSelected={selectedTag === "이단 케이크"} onClick={() => onTagClickHandler("이단 케이크")} />
                <CakeComponent imageUrl="/leaf.png" context="비건 케이크" isSelected={selectedTag === "비건 케이크"} onClick={() => onTagClickHandler("비건 케이크")} />
                <CakeComponent imageUrl="/ricecake_final.png" context="떡 케이크" isSelected={selectedTag === "떡 케이크"} onClick={() => onTagClickHandler("떡 케이크")} />
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


