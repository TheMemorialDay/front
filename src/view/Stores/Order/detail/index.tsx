import React, { ChangeEvent, useEffect, useState } from 'react'
import './style.css'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from 'react-router-dom';
import { ST_ORDER_DONE_ABSOLUTE_PATH } from '../../../../constants';
import { getProductDetailRequest } from '../../../../apis';
import { GetProductDetailResponseDto } from '../../../../apis/dto/response/stores';
import { ResponseDto } from '../../../../apis/dto/response';


interface PreviewUrlProps {
  imageUrl: string;
  onClick: () => void;
}

interface ThemaProps {
  contents: string;
}

interface SizeProps {
  size: string;
  addPrice: number;
}

interface FlavorProps {
  flavor: string;
  addPrice: string | number;
}

// component: 사진 미리보기 컴포넌트 //
function Previews({imageUrl, onClick}: PreviewUrlProps) {

  //render: 사진 미리보기 렌더링 //
  return (
    <div id='preview' style={{backgroundImage: `url(${imageUrl})`}} onClick={onClick}></div>
  )
}

// component: 상품 테마 컴포넌트 //
function Tags({contents}: ThemaProps) {

  // render: 상품 태그 렌더링 //
  return (
      <div id='tags'>{contents}</div>
  )
}

// component: 픽업 날짜 선택 컴포넌트 //
function CalendarInput() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date: Date | null) => setSelectedDate(date)}
      showTimeSelect  
      timeFormat="HH:mm"  
      timeIntervals={30}  
      timeCaption="Time"  
      dateFormat="yyyy년 MM월 dd일 h:mm aa"  
      placeholderText="날짜와 시간을 선택하세요"
    />
  );
}

// component: 사이즈 라디오 버튼 컴포넌트 //
function RadioButtonGroupSize({size, addPrice}: SizeProps) {
  
  // state: 선택된 값 저장하는 상태 //
  const [selectedOption, setSelectedOption] = useState<string>('');

  // event handler: 라디오 버튼 선택 핸들러 //
  const handleOptionChange = (e:ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);  // 선택한 라디오 버튼의 값을 상태로 설정
  };

  return (
      <label style={{marginLeft: "15px"}}>
        <input
          type="radio"
          name='size'
          value={size}
          checked={selectedOption === size}
          onChange={handleOptionChange}
          style={{
            fontSize: "16px",
            fontWeight: "500"
          }}
        />
        {size}{addPrice? `(+ ${addPrice.toLocaleString()}원)` : ''}
      </label>
  );
};

// component: 맛 라디오 버튼 컴포넌트 //
function RadioButtonGroupFlavor({flavor, addPrice}: FlavorProps) {
  
  // state: 선택된 값 저장하는 상태 //
  const [selectedOption, setSelectedOption] = useState<string>('');

  // event handler: 라디오 버튼 선택 핸들러 //
  const handleOptionChange = (e:ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);  // 선택한 라디오 버튼의 값을 상태로 설정
  };

  return (
      <label style={{marginLeft: "15px"}}>
        <input
          type="radio"
          name='flavor'
          value={flavor}
          checked={selectedOption === flavor}
          onChange={handleOptionChange}
          style={{
            fontSize: "16px",
            fontWeight: "500"
          }}
        />
        {flavor}{addPrice? `(+ ${addPrice.toLocaleString()}원)` : ''}
      </label>
  );
};

// component: 상품 상세 페이지(주문 페이지)
export default function Order() {

  // state: 가게, 상품 정보 //
  const {storeNumber, productNumber} = useParams();

  // state: 상품 정보 //
  const [cakeName, setCakeName] = useState<string>('');
  const [caution, setCaution] = useState<string>('');
  const [introduce, setIntroduce] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [themaList, setThemaList] = useState<string[]>([]);
  const [imageList, setImageList] = useState<string[]>([]);
  const [cakeToday, setCakeToday] = useState<boolean>(false);

  // state: 옵션 라디오 버튼 상태 //
  const [sizeOptions, setSizeOptions] = useState<{ size: string; addPrice: number }[]>([]);
  const [flavorOptions, setFlavorOptions] = useState<{ flavor: string; addPrice: number }[]>([]);

  // state: 사진 미리보기 상태 //
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // state: 케이크 주문 관련 상태 //
  const [cakeSize, setCakeSize] = useState<string>('');
  const [cakeFlavor, setCakeFlavor] = useState<string>('');
  const [cakeCount, setCakeCount] = useState<number>(1);
  const [request, setRequest] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(false);

  // state: 케이크 주문 가능 상태 //
  const [isPossible, setIsPossible] = useState<boolean>(false);

  // function: navigator //
  const navigator = useNavigate();

  // function: 숫자 쉼표 찍어주는 함수 //
  function formatNumberWithCommas(number: number): string {
    return new Intl.NumberFormat('en-US').format(number);
  }

  // function: get product detail 함수 //
  const getProductDetail = () => {
    if(storeNumber && productNumber) getProductDetailRequest(storeNumber, productNumber).then(getProductDetailRespone);
    else {
      alert("잘못된 접근입니다.");
      return;
    }
  }

  // function: get product detail response 처리 //
  const getProductDetailRespone = (responseBody: GetProductDetailResponseDto | ResponseDto | null) => { 
    //console.log(responseBody);
    const message = 
      !responseBody ? "서버에 문제가 있습니다." :
      responseBody.code === 'NS' ? '존재하지 않는 가게입니다.' :
      responseBody.code === 'NP' ? '존재하지 않는 상품입니다.' : 
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if(!isSuccessed) {
      alert(message);
      return;
    }

    const {orderProductDetails} = responseBody as GetProductDetailResponseDto;
    setCakeName(orderProductDetails.productName);
    setPrice(orderProductDetails.productPrice);
    setCaution(orderProductDetails.storeCaution);
    setIntroduce(orderProductDetails.productIntroduce);
    setThemaList(orderProductDetails.themes);
    setImageList(orderProductDetails.productImages);
    setCakeToday(orderProductDetails.productToday);

    // options 배열 확인
    // orderProductDetails.options.forEach((option, index) => {
    //   console.log(`Option ${index + 1}: ${option.productOptionName}`);

    //   // optionDetails 확인
    //   option.optionDetails.forEach((detail) => {
    //     console.log(`  Category: ${detail.productCategory}, Price: ${detail.productOptionPrice}`);
    //   });
    // });

    const filteredSizeOptions = orderProductDetails.options
        .filter(option => option.productOptionName === "크기")
        .flatMap(option => option.optionDetails.map(detail => ({
            size: detail.productCategory,
            addPrice: detail.productOptionPrice,
        })));
    setSizeOptions(filteredSizeOptions);

    const filteredFlavorOptions = orderProductDetails.options
    .filter(option => option.productOptionName === "맛")
    .flatMap(option => option.optionDetails.map(detail => ({
        flavor: detail.productCategory,
        addPrice: detail.productOptionPrice,
    })));
    setFlavorOptions(filteredFlavorOptions);
  }

  // event handler: 현재 이미지 인덱스에 따른 이미지 변경 //
  const showCurrentImage = () => {
    return imageList.length > 0 ? imageList[currentImageIndex] : '';
  };

  // event handler: 다음 이미지로 이동 //
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
    );
  };

  // event handler: 이전 이미지로 이동 //
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageList.length - 1 : prevIndex - 1
    );
  };

  // event handler: 특정 이미지로 이동 (Previews 클릭 시) //
  const handlePreviewClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // event handler: 케이크 수량 up 버튼 클릭 핸들러 //
  const onPlusClickHandler = () => {
    setCakeCount(cakeCount + 1);
  }

  // event handler: 케이크 수량 down 버튼 클릭 핸들러 //
  const onMinusClickHandler = () => {
    setCakeCount(cakeCount - 1);

    if(cakeCount <= 0) {
      alert("케이크 최소 수량은 1개입니다.");
      setCakeCount(1);
    }
  }

  // event handler: 요청 사항 변경 핸들러 //
  const onRequestChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const {value} = event.target;
    setRequest(value);
  }

  // event handler: 체크박스 상태 변경 핸들러
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);  // 체크 여부 상태 업데이트
  };

  // event handler: 주문하기 버튼 클릭 이벤트 핸들러 //
  const onOrderClickHandler = () => {
    navigator(ST_ORDER_DONE_ABSOLUTE_PATH);
  }

  // effect: 상품 상세 정보 가져오기 //
  useEffect(getProductDetail, []);

  // render: 주문 상세 페이지 렌더링 //
  return (
      <div id='product-order'>
        <div className='photo-zone'>
          <div className='arrow-left' onClick={handlePrevImage}></div>
          <div className='image-box' style={{display: "flex", flexDirection: "column"}}>
            <div className='images' style={{ backgroundImage: `url(${showCurrentImage()})`, backgroundSize: 'cover', backgroundRepeat: "no-repeat" }}></div>
            <div className='preview-box'>
              {imageList.length > 0 ? imageList.map((image, index) => <Previews key={index} imageUrl={image} onClick={() => handlePreviewClick(index)}/>) : '' }
            </div>
          </div>
          <div className='arrow-right' onClick={handleNextImage}></div>
        </div>

        <div className='order-page'>
            <div>
              <div className='text'>케이크 주문서 작성</div>
              <hr className='custom-hr'/>
              <div className='cake-name'>{cakeName}</div>
              <div className='thema-zone'>
                {themaList.length > 0 ?  themaList.map((thema, index) => <Tags key={index} contents={thema} />) : '' }
              </div>
              <div className='cake-introduce'>{introduce}</div>
              <div className='cake-price'>가격 {formatNumberWithCommas(price)}</div>
            </div>
              
            <div className='pickup-date'>
              <div className='option-title'>픽업 일시 선택<span style={{color: "red"}}>*</span></div>
              <CalendarInput />
            </div>

            <div className='pick-size'>
              <div className='option-title'>사이즈 선택<span style={{color: "red"}}>*</span></div>
              <div className='radio-group' style={{marginTop: "15px"}}>
                {sizeOptions.map((option, index) => ( <RadioButtonGroupSize key={index} size={option.size} addPrice={option.addPrice} />))}
              </div>
            </div>

            <div className='pick-size' style={{marginTop: "30px"}}>
              <div className='option-title'>맛 선택<span style={{color: "red"}}>*</span></div>
              <div className='radio-group' style={{marginTop: "15px"}}>
                {flavorOptions.map((option, index) => (<RadioButtonGroupFlavor key={index} flavor={option.flavor} addPrice={option.addPrice}/>) )}
              </div>
            </div>

            <div className='pickup-date'>
              <div className='option-title'>수량 입력<span style={{color: "red"}}>*</span></div>
              <div className='count-handler'>
                <div className='count-up' onClick={onPlusClickHandler}></div>
                <div style={{fontSize: "16px", cursor:"pointer"}}>{cakeCount}</div>
                <div className='count-down' onClick={onMinusClickHandler}></div>
              </div>
            </div>

            <div>
              <div className='option-title'>요청사항</div>
              <textarea className='textarea' placeholder='자유롭게 입력하세요.' onChange={onRequestChangeHandler}/>
            </div>

            <div style={{display:"flex", flexDirection:"column", marginTop: "20px"}}>
              <div className='option-title'>유의사항 확인<span style={{color: "red"}}>*</span></div>
              <div style={{marginTop: "20px"}}>{caution}</div>
              <label className='checkbox'>
                <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange}/>
                상기의 내용을 확인하였으며, 불이익시 가게가 책임지지 않음에 동의합니다.
                </label>
            </div>

            <div className='total-price'>최종 금액 {formatNumberWithCommas(10000)} 원</div>

            <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "35px"}}>
              <div className='order-button' onClick={onOrderClickHandler}>주문하기</div>
            </div>
      </div>
  </div>
  ) 
}
