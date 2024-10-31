import React, { ChangeEvent, KeyboardEvent, MouseEvent, useRef, useState } from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom';
import { MY_PRODUCT_ABSOLUTE_PATH } from '../../../../constants';

interface ProductProps {
    productImageUrls: string[];
    productName: string;
    roductIntroduce: string;
    productPrice: number;
    //options: Option[]; 맛, 옵션
    themas: string[]; // 귀여움, 러블리 등
    tag: string; // 포토, 레터링 등
}

interface TagProps {
    content: string;
    onRemove?: () => void;
}

// component: 상품 테마 컴포넌트 //
function Tags({ content }: TagProps) {

    // render: 상품 태그 렌더링 //
    return (
        <div id='tags'>{content}</div>
    )
}

// component: 선택된 상품 테마 컴포넌트 //
function SelectedTags({ content, onRemove }: TagProps) {

    // render: 선택된 상품 태그 렌더링 //
    return (
        <div className='no-select'>
            <div className='x-sign' onClick={onRemove}>X</div>
            <div id='tags'>{content}</div>
        </div>
    )
}

// component: 케이크 크기 옵션 컴포넌트 //
function SizeOption() {

    // state: 케이크 크기 라디오 버튼 생성 상태 //
    const [radioButtons, setRadioButtons] = useState<{ size: string, price: string }[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [showInput, setShowInput] = useState<boolean>(false);
    const [additionalPrice, setAdditionalPrice] = useState<string>('');

    // event handler: 크기 추가 버튼 클릭 이벤트 핸들러 //
    const handlePlusButtonClick = () => {
        setShowInput(true);
    };

    // event handler: 크기 입력 변경 이벤트 핸들러 //
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    // event handler: 추가 금액 입력 변경 이벤트 핸들러 //
    const onAdditionalPriceHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setAdditionalPrice(event.target.value);
    }

    // event handler: 크기 엔터 키 입력 이벤트 //
    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
            setRadioButtons((prevButtons) => [...prevButtons, { size: inputValue, price: additionalPrice || '0' }]);
            setInputValue('');  // Clear the input field
            setAdditionalPrice('');
            setShowInput(false);  // Hide input field after adding
        }
    };

    // event handler: 라디오 버튼 삭제 이벤트 핸들러 //
    const handleRemoveButtonClick = (indexToRemove: number) => {
        setRadioButtons((prevButtons) => prevButtons.filter((_, index) => index !== indexToRemove));
    };

    // render: 케이크 크기 옵션 렌더링 //
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

                    {radioButtons.map((button, index) => (
                        <div key={index} style={{ display: "flex", flexDirection: "row", marginRight: "20px" }}>
                            <div className='xx-sign' onClick={() => handleRemoveButtonClick(index)}>X</div>
                            <input type="radio" id={`radio-${index}`} name="radioGroup" value={button.size} disabled />
                            <label htmlFor={`radio-${index}`} style={{ marginLeft: "5px" }}>{button.size} (+{button.price}원)</label>
                        </div>
                    ))}
                </div>
                <div className='plus-button' onClick={handlePlusButtonClick}>추가</div>
            </div>
        </div>
    )
}

// component: 케이크 맛 옵션 컴포넌트 //
function FlavorOption() {

    // state: 케이크 맛 라디오 버튼 생성 상태 //
    const [flavorRadioButtons, setFlavorRadioButtons] = useState<{ flavor: string, price: string }[]>([]);
    const [inputFlavorValue, setInputFlavorValue] = useState<string>('');
    const [showFlavorInput, setShowFlavorInput] = useState<boolean>(false);
    const [flavorAdditionalPrice, setFlavorAddtionalPrice] = useState<string>('');

    // event handler: 맛 추가 버튼 클릭 이벤트 핸들러 //
    const handleFlavorPlusButtonClick = () => {
        setShowFlavorInput(true);
    };

    // event handler: 맛 입력 변경 이벤트 핸들러 //
    const handleFlavorInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setInputFlavorValue(value);
    };

    // event handler: 맛 가격 입력 변경 이벤트 핸들러 //
    const flavorPriceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setFlavorAddtionalPrice(event.target.value);
    }

    // event handler: 맛 엔터 키 입력 이벤트 //
    const handleFlavorKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputFlavorValue.trim() !== '') {
            setFlavorRadioButtons((prevButtons) => [...prevButtons, { flavor: inputFlavorValue, price: flavorAdditionalPrice || '0' }]);
            setInputFlavorValue('');  // Clear the input field
            setFlavorAddtionalPrice('');
            setShowFlavorInput(false);  // Hide input field after adding
        }
    };

    // event handler: 라디오 버튼 삭제 이벤트 핸들러 //
    const handleRemoveButtonClick = (indexToRemove: number) => {
        setFlavorRadioButtons((prevButtons) => prevButtons.filter((_, index) => index !== indexToRemove));
    };

    // render: 케이크 맛 옵션 렌더링 //
    return (
        <div className='option-box'>맛
            <div className='radio-handler'>
                <div className='detail-text'>
                    {showFlavorInput && (
                        <div>
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

                    {flavorRadioButtons.map((button, index) => (
                        <div key={index} style={{ display: "flex", flexDirection: "row", marginRight: "20px" }}>
                            <div className='xx-sign' onClick={() => handleRemoveButtonClick(index)}>X</div>
                            <input type="radio" id={`radio-${index}`} name="radioGroup" value={button.flavor} disabled />
                            <label htmlFor={`radio-${index}`} style={{ marginLeft: "5px" }}>{button.flavor} (+{button.price}원)</label>
                        </div>
                    ))}
                </div>
                <div className='plus-button' onClick={handleFlavorPlusButtonClick}>추가</div>
            </div>
        </div>
    )
}

// component: 사용자 추가 옵션 컴포넌트 //
function NewOption() {

    // state: 옵션 추가 버튼 상태 //
    const [newInputValue, setNewInputValue] = useState<string>('');
    const [radioInputBool, setRadioInputBool] = useState<boolean>(false);
    const [radioValueBool, setRadioValueBool] = useState<boolean>(false);
    const [inputDetailValue, SetInputDetailValue] = useState<string>('');
    const [newOptions, setNewOptions] = useState<{ option: string, price: string }[]>([]);
    const [newOptionAdditionalPrice, setNewOptionAdditionalPrice] = useState<string>('');

    // event handler: 옵션 추가 이름 변경 이벤트 핸들러 //
    const onChangeNewOptionHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setNewInputValue(value);
    }

    // event handler: 새로운 옵션 이름 엔터 키 입력 이벤트 //
    const handleNewOptionKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && newInputValue.trim() !== '') {
            setRadioInputBool(!radioInputBool);
        }
    };

    // event handler: 새로운 옵션 라디오 버튼 추가 버튼 클릭 이벤트 핸들러 //
    const onNewOptionClickHandler = () => {
        setRadioValueBool(!radioValueBool);
    }

    // event handler: 새로운 옵션 디테일 입력 변경 이벤트 핸들러 //
    const onNewOptionDetailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        SetInputDetailValue(event.target.value);
    }

    // event handler: 새로운 옵션 디테일 가격 입력 변경 이벤트 핸들러 //
    const onNewOptionAdditionalPriceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setNewOptionAdditionalPrice(event.target.value);
    }

    // event handler: 새로운 옵션 디테일 엔터 키 입력 이벤트 핸들러 //
    const onNewOptionDetailKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputDetailValue.trim() !== '') {
            setNewOptions((prevButtons) => [...prevButtons, { option: inputDetailValue, price: newOptionAdditionalPrice || '0' }]);
            SetInputDetailValue('');  // Clear the input field
            setNewOptionAdditionalPrice('');
            setRadioValueBool(false);  // Hide input field after adding
        }
    }

    // event handler: 라디오 버튼 삭제 이벤트 핸들러 //
    const handleRemoveButtonClick = (indexToRemove: number) => {
        setNewOptions((prevButtons) => prevButtons.filter((_, index) => index !== indexToRemove));
    };

    // render: 사용자 추가 옵션 렌더링 //
    return (
        <div className='option-box' style={{ marginBottom: "20px" }}>
            <input className='new-option-name' placeholder='옵션을 입력하세요.(ex: 색상)' onKeyPress={handleNewOptionKeyPress}
                onChange={onChangeNewOptionHandler} />

            <div className='radio-handler'>
                <div className='detail-text'>
                    {radioValueBool && (
                        <div>
                            <input
                                className='cake-size'
                                type="text"
                                value={inputDetailValue}
                                onChange={onNewOptionDetailChangeHandler}
                                placeholder="입력"
                                autoFocus
                            />
                            <input
                                className='cake-size-price'
                                type="text"
                                value={newOptionAdditionalPrice}
                                onChange={onNewOptionAdditionalPriceChangeHandler}
                                onKeyPress={onNewOptionDetailKeyPressHandler}
                                placeholder="추가 금액(ex: 5000) 없으면 0, 입력 후 엔터"
                            />
                        </div>
                    )}

                    {newOptions.map((button, index) => (
                        <div key={index} style={{ display: "flex", flexDirection: "row", marginRight: "20px" }}>
                            <div className='xx-sign' onClick={() => handleRemoveButtonClick(index)}>X</div>
                            <input type="radio" id={`radio-${index}`} name="radioGroup" value={button.option} disabled />
                            <label htmlFor={`radio-${index}`} style={{ marginLeft: "5px" }}>{button.option} (+{button.price}원)</label>
                        </div>
                    ))}
                </div>
                <div className='plus-button' onClick={onNewOptionClickHandler}>추가</div>
            </div>
        </div>
    )
}

// component: 사용자 추가 옵션 리스트 컴포넌트 //
function OptionList() {

    // state: 옵션 리스트 상태 //
    const [optionComponents, setOptionComponents] = useState<number[]>([]);

    // event handler: 옵션 추가 버튼 클릭 시 새로운 NewOption 컴포넌트 추가 //
    const handleAddNewOption = () => {
        if (optionComponents.length < 3) {  // 옵션이 3개 미만일 때만 추가
            setOptionComponents([...optionComponents, optionComponents.length + 1]);
        } else {
            alert('옵션은 최대 3개까지만 추가할 수 있습니다.');
        }
    };

    // render: 사용자 추가 옵션 리스트 렌더링 //
    return (
        <div>
            <div>{optionComponents.map((_, index) => (<NewOption key={index} />))}</div>
            <div className='option-add-box'>
                <div className='plus-button-option' onClick={handleAddNewOption}>옵션 추가</div>
            </div>
        </div>
    )
}

// component: 이미지 파일 선택 컴포넌트 //
function Pictures() {

    // state: file 선택 관련 상태, 변수 //
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // function: 이미지 파일 선택창 열기 //
    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    // event handler: 파일 선택 시 호출되는 핸들러 //
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            const allFiles = [...selectedFiles, ...newFiles].slice(0, 5); // 최대 5장까지 유지
            setSelectedFiles(allFiles);
        }
    };

    // event handler: 초기화 버튼 클릭 이벤트 핸들러 //
    const onResetImagesHandler = () => {
        setSelectedFiles([]);
    }

    // render: 이미지 파일 선택 렌더링 //
    return (
        <div>
            <div className='arrange'>
                <div className='notice' style={{ textAlign: "left" }}>* 첫 번째 사진은 대표 사진입니다.</div>
                <div className='remove-pics' onClick={onResetImagesHandler}>초기화</div>
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
                    {selectedFiles.map((file, index) => (
                        <div key={index} className='legacy-product'
                            style={{
                                backgroundImage: `url(${URL.createObjectURL(file)})`,
                                backgroundSize: "cover"
                            }}
                        />))}
                </div>
            </div>
        </div>
    )
}

// component: 상품 테마 컴포넌트 //
function ProductTags() {

    // state: 케이크 태그 상태 //
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // event handler: 태그 클릭 이벤트 핸들러 //
    const handleTagClick = (tag: string) => {
        if (!selectedTags.includes(tag) && selectedTags.length < 5) { // 태그가 5개 미만일 때만 추가
            setSelectedTags([...selectedTags, tag]);
        } else if (selectedTags.length >= 5) {
            alert('상품 테마는 최대 5개까지만 선택할 수 있습니다.');
        }
    };

    // event handler: 태그 삭제 이벤트 핸들러 //
    const handleTagRemove = (tag: string) => {
        setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
    };

    // render: 상품 태그 화면 렌더링 //
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
                        <div style={{ display: "flex", flexDirection: "row" }}> {selectedTags.map(tag => (<SelectedTags key={tag} content={tag}
                            onRemove={() => handleTagRemove(tag)} />))}</div>
                    </div>
                }
            </div>
        </div>
    )
}

interface CakeComponentProps {
    imageUrl: string;
    context: string;
    isSelected: boolean;
    onClick: () => void;
}

// component: 케이크 태그 컴포넌트 //
function CakeComponent({ imageUrl, context, isSelected, onClick }: CakeComponentProps) {

    // render: 케이크 태그 렌더링 //
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
}

// component: 상품 태그 컴포넌트 //
function ProductThema() {

    // state: 선택된 태그를 저장하는 상태
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // event handler: 태그 클릭 이벤트 핸들러
    const onTagClickHandler = (tag: string) => {
        setSelectedTag(tag); // 클릭된 태그를 상태로 저장
    };

    // render: 상품 태그 렌더링 //
    return (
        <div className='store-filter' style={{ marginBottom: "30px" }}>
            <div className='filter-box'>
                <CakeComponent imageUrl="/photo.png" context="포토" isSelected={selectedTag === "포토"} onClick={() => onTagClickHandler("포토")} />
                <CakeComponent imageUrl="/abc.png" context="레터링" isSelected={selectedTag === "레터링"} onClick={() => onTagClickHandler("레터링")} />
                <CakeComponent imageUrl="/piece.png" context="한입 케이크" isSelected={selectedTag === "한입 케이크"} onClick={() => onTagClickHandler("한입 케이크")} />
                <CakeComponent imageUrl="/box.png" context="도시락 케이크" isSelected={selectedTag === "도시락 케이크"} onClick={() => onTagClickHandler("도시락 케이크")} />
                <CakeComponent imageUrl="/level.png" context="이단 케이크" isSelected={selectedTag === "이단 케이크"} onClick={() => onTagClickHandler("이단 케이크")} />
                <CakeComponent imageUrl="/leaf.png" context="비건 케이크" isSelected={selectedTag === "비건 케이크"} onClick={() => onTagClickHandler("비건 케이크")} />
                <CakeComponent imageUrl="/ricecake_final.png" context="떡 케이크" isSelected={selectedTag === "떡 케이크"} onClick={() => onTagClickHandler("떡 케이크")} />
            </div>
        </div>
    )
}

// component: 상품 추가 화면 컴포넌트 //
function Add() {

    // state: 상품 상태 //
    const [productName, setProductName] = useState<string>('');
    const [productExplain, setProductExplain] = useState<string>('');
    const [defaultPrice, setDefaultPrice] = useState<number>(0);
    const [onedayCake, setOnedayCake] = useState<boolean | null>(null);

    // function: 네비게이터 //
    const navigator = useNavigate();

    // event handler: 메뉴 이름 변경 이벤트 핸들러 //
    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setProductName(value);
    }

    // event handler: 메뉴 설명 변경 이벤트 핸들러 //
    const onExplainChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setProductExplain(value);
    }

    // event handler: 메뉴 기본 가격 변경 이벤트 핸들러 //
    const onDefaultPriceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        const pattern = /^[0-9]{6}$/;
        const isTrue = pattern.test(value);

        if (isTrue) setDefaultPrice(parseInt(value, 10));
        else return;
    }

    // event handler: 당일 케이크 여부 선택 이벤트 핸들러 //
    const selectedOnedayClickHandler = (onedayCheck: boolean) => {
        setOnedayCake(onedayCheck);
        console.log(onedayCheck);
    }

    // event handler: 취소 버튼 클릭 이벤트 핸들러 //
    const onCancleClickHandler = () => {
        navigator(MY_PRODUCT_ABSOLUTE_PATH);
    }

    // event handler: 등록 버튼 클릭 이벤트 핸들러 //
    const onRegisterClickHandler = () => {
        // 등록 api
        navigator(MY_PRODUCT_ABSOLUTE_PATH);
    }

    // render: 상품 추가/수정 화면 렌더링 //
    return (
        <div id='add-product'>
            <div className='title'>상품 관리</div>
            <hr className='custom-hr' />

            <Pictures />

            <div className='product-info'>
                <input className='product-name' placeholder='메뉴 이름' onChange={onNameChangeHandler} />
                <textarea className='product-explain' placeholder='메뉴 설명' onChange={onExplainChangeHandler} />
                <input className='product-price' placeholder='메뉴 최소 가격 (ex: 30000)' onChange={onDefaultPriceChangeHandler} />

                <div className='oneday-cake'>
                    <div onClick={() => { selectedOnedayClickHandler(true) }}
                        className={onedayCake === true ? 'possible' :
                            onedayCake === null ? 'impossible' : 'impossible'}>당일 케이크 가능</div>
                    <div onClick={() => { selectedOnedayClickHandler(false) }}
                        className={onedayCake === false ? 'possible' :
                            onedayCake === null ? 'impossible' : 'impossible'}>당일 케이크 불가능</div>
                </div>

                <div style={{ fontSize: "20px", fontWeight: "700", marginTop: "30px" }}>
                    케이크 종류를 하나 선택해 주세요.
                </div>
                <ProductThema />
                <SizeOption />
                <FlavorOption />
                <OptionList />
                <ProductTags />
            </div>

            <div className='button-box'>
                <div className='button-cancle' onClick={onCancleClickHandler}>취소</div>
                <div className='button-register' onClick={onRegisterClickHandler}>등록</div>
            </div>
        </div>
    )
}

// component: 상품 추가/수정 화면 컴포넌트 //
export default function Update() {

    // render: 상품 추가/수정 화면 렌더링 //
    return (
        <Add />
    )
}