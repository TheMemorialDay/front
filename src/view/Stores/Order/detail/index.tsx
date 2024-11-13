import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from 'react-router-dom';
import { ACCESS_TOKEN, LOGIN_PATH, ST_ORDER_DONE_ABSOLUTE_PATH } from '../../../../constants';
import { getProductDetailRequest, postOrderRequest } from '../../../../apis';
import { GetProductDetailResponseDto } from '../../../../apis/dto/response/stores';
import { ResponseDto } from '../../../../apis/dto/response';
import { Option, RunningHours, SelectedOptionInterface } from '../../../../types';
import { useCookies } from 'react-cookie';
import { PostOrderRequestDto } from '../../../../apis/dto/request/order';
import { useSignInUserStore } from '../../../../stores';
import dayjs from 'dayjs';

interface PreviewUrlProps {
  imageUrl: string;
  onClick: () => void;
}

interface ThemaProps {
  contents: string;
}

interface RadioProps {
  name: string;
  value: string;
  price: number;
  selectedOptions: SelectedOptionInterface[],
  optionCategoryNumber: number;
  onSelect: (name: string, value: string, price: number, optionCategoryNumber: number) => void;
}

// component: 사진 미리보기 컴포넌트 //
function Previews({ imageUrl, onClick }: PreviewUrlProps) {

  //render: 사진 미리보기 렌더링 //
  return (
    <div id='preview' style={{ backgroundImage: `url(${imageUrl})` }} onClick={onClick}></div>
  )
}

// component: 상품 테마 컴포넌트 //
function Tags({ contents }: ThemaProps) {

  // render: 상품 태그 렌더링 //
  return (
    <div id='tags'>{contents}</div>
  )
}

// component: 옵션 라디오 버튼 컴포넌트 //
function RadioButtonGroup({ name, value, price, selectedOptions, onSelect, optionCategoryNumber }: RadioProps) {

  // event handler: 라디오 버튼 선택 핸들러 //
  const handleOptionChange = () => {
    onSelect(name, value, price, optionCategoryNumber);
  };

  const isChecked = selectedOptions.some(item => item.name === name && item.value === value);

  return (
    <label style={{ marginLeft: "15px" }}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={isChecked}
        onChange={handleOptionChange}
        style={{
          fontSize: "16px",
          fontWeight: "500"
        }}
      />
      {value}{price ? `(+ ${price.toLocaleString()}원)` : ''}
    </label>
  );
};

// component: 상품 상세 페이지(주문 페이지)
export default function Order() {

  // state: 로그인 유저 상태 //
  const { signInUser } = useSignInUserStore();

  // state: 쿠키 상태 //
  const [cookies] = useCookies();

  // state: 가게, 상품 정보 //
  const { storeNumber, productNumber } = useParams();

  // state: 상품 정보 //
  const [cakeName, setCakeName] = useState<string>('');
  const [caution, setCaution] = useState<string>('');
  const [introduce, setIntroduce] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [themaList, setThemaList] = useState<string[]>([]);
  const [imageList, setImageList] = useState<string[]>([]);
  const [cakeToday, setCakeToday] = useState<boolean>(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [productTag, setProductTag] = useState<string>('');

  // state: 사진 미리보기 상태 //
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const storeUrlInputRef = useRef<HTMLInputElement | null>(null);

  // state: 케이크 주문 관련 상태 //
  const [cakeCount, setCakeCount] = useState<number>(1);
  const [request, setRequest] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');

  // state: 선택 옵션 리스트 상태 //
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionInterface[]>([]);

  // state: 가격 상태 //
  const [finalPrice, setFinalPrice] = useState<number>(price);

  // state: 가게 영업일 시간 상태 //
  const [mondayOpen, setMondayOpen] = useState<number | null>(null);
  const [mondayLast, setMondayLast] = useState<number | null>(null);
  const [tuesdayOpen, setTuesdayOpen] = useState<number | null>(null);
  const [tuesdayLast, setTuesdayLast] = useState<number | null>(null);
  const [wednesdayOpen, setWednesdayOpen] = useState<number | null>(null);
  const [wednesdayLast, setWednesdayLast] = useState<number | null>(null);
  const [thursdayOpen, setThursdayOpen] = useState<number | null>(null);
  const [thursdayLast, setThursdayLast] = useState<number | null>(null);
  const [fridayOpen, setFridayOpen] = useState<number | null>(null);
  const [fridayLast, setFridayLast] = useState<number | null>(null);
  const [saturdayOpen, setSaturdayOpen] = useState<number | null>(null);
  const [saturdayLast, setSaturdayLast] = useState<number | null>(null);
  const [sundayOpen, setSundayOpen] = useState<number | null>(null);
  const [sundayLast, setSundayLast] = useState<number | null>(null);

  // state: 케이크 주문 가능 상태 //
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // function: 선택된 요일에 따라 open, last 시간 설정 //
  const getOpeningHours = (day: number) => {
    switch (day) {
      case 1: return { open: mondayOpen, last: mondayLast };
      case 2: return { open: tuesdayOpen, last: tuesdayLast };
      case 3: return { open: wednesdayOpen, last: wednesdayLast };
      case 4: return { open: thursdayOpen, last: thursdayLast };
      case 5: return { open: fridayOpen, last: fridayLast };
      case 6: return { open: saturdayOpen, last: saturdayLast };
      case 0: return { open: sundayOpen, last: sundayLast };
      default: return { open: null, last: null };
    }
  };

  // function: 날짜 제한 함수
  const filterDate = (date: Date) => {
    const dayOfWeek = date.getDay(); // 선택된 날짜의 요일 (0 = 일요일, 1 = 월요일, ..., 6 = 토요일)
    const { open, last } = getOpeningHours(dayOfWeek);

    // open과 last가 null인 경우 날짜 선택을 제한
    if (open === null || last === null) {
      return false;
  }
  return true;
};

  // function: 시간 제한 함수 //
  const filterTime = (time: Date) => {
    if (selectedDate) {
      const now = new Date();
      const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      const dayOfWeek = selectedDate.getDay();
      const { open, last } = getOpeningHours(dayOfWeek);
      const hour = time.getHours();

      // 선택된 날짜가 오늘인 경우, 현재 시간부터 2시간 이내 시간 제한
      if (
        selectedDate.toDateString() === now.toDateString() && (time < now || time < twoHoursLater)
      ) {
          return false;
      }

       // 당일 케이크가 불가하면 당일은 선택하지 못하도록 함
      if (!cakeToday && selectedDate.toDateString() === now.toDateString()) {
        return false;
      }

      return open !== null && last !== null ? hour >= open && hour < last : false;
    }
    return true;
  };

  // function: navigator //
  const navigator = useNavigate();

  // function: 숫자 쉼표 찍어주는 함수 //
  function formatNumberWithCommas(number: number): string {
    return new Intl.NumberFormat('en-US').format(number);
  }

  // function: get product detail 함수 //
  const getProductDetail = () => {
    if (storeNumber && productNumber) getProductDetailRequest(storeNumber, productNumber).then(getProductDetailRespone);
    else {
      alert("잘못된 접근입니다.");
      return;
    }
  }

  // function: get product detail response 처리 //
  const getProductDetailRespone = (responseBody: GetProductDetailResponseDto | ResponseDto | null) => {
    const message =
      !responseBody ? "서버에 문제가 있습니다." :
        responseBody.code === 'NS' ? '존재하지 않는 가게입니다.' :
          responseBody.code === 'NP' ? '존재하지 않는 상품입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
      alert(message);
      return;
    }

    const { orderProductDetails } = responseBody as GetProductDetailResponseDto;

    if (orderProductDetails.storeCaution) {
      setCaution(orderProductDetails.storeCaution.replace(/\\n/g, "\n"));
    };

    setCakeName(orderProductDetails.productName);
    setPrice(orderProductDetails.productPrice);
    setFinalPrice(orderProductDetails.productPrice);
    setIntroduce(orderProductDetails.productIntroduce);
    setThemaList(orderProductDetails.themes);
    setImageList(orderProductDetails.productImages);
    setCakeToday(orderProductDetails.productToday);
    setProductTag(orderProductDetails.productTag);

    const parseTime = (time: string) => {
      return time === "휴무일" ? null : parseInt(time.split(":")[0], 10);
    };

    setMondayOpen(parseTime(orderProductDetails.mondayOpen));
    setMondayLast(parseTime(orderProductDetails.mondayLast));
    setTuesdayOpen(parseTime(orderProductDetails.tuesdayOpen));
    setTuesdayLast(parseTime(orderProductDetails.tuesdayLast));
    setWednesdayOpen(parseTime(orderProductDetails.wednesdayOpen));
    setWednesdayLast(parseTime(orderProductDetails.wednesdayLast));
    setThursdayOpen(parseTime(orderProductDetails.thursdayOpen));
    setThursdayLast(parseTime(orderProductDetails.thursdayLast));
    setFridayOpen(parseTime(orderProductDetails.fridayOpen));
    setFridayLast(parseTime(orderProductDetails.fridayLast));
    setSaturdayOpen(parseTime(orderProductDetails.saturdayOpen));
    setSaturdayLast(parseTime(orderProductDetails.saturdayLast));
    setSundayOpen(parseTime(orderProductDetails.sundayOpen));
    setSundayLast(parseTime(orderProductDetails.sundayLast));

    setOptions(orderProductDetails.options);
    const initSelectedOptions = orderProductDetails.options.map(option => ({ name: option.productOptionName, value: '', price: 0, optionCategoryNumber: 0 }));
    setSelectedOptions(initSelectedOptions);
    setOptions(orderProductDetails.options);
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

  // event handler: 요청 사항 변경 핸들러 //
  const onRequestChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setRequest(value);
  }

  // event handler: 체크박스 상태 변경 핸들러
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);  // 체크 여부 상태 업데이트
  };

  // event handler: 옵션 선택 변경 핸들러 //
  const onOptionSelectHandler = (name: string, value: string, price: number, optionCategoryNumber: number) => {
    const newSelectedOptions = [...selectedOptions];
    const index = newSelectedOptions.findIndex(option => option.name === name);
    newSelectedOptions[index].optionCategoryNumber = optionCategoryNumber;
    newSelectedOptions[index].value = value;
    newSelectedOptions[index].price = price;
    setSelectedOptions(newSelectedOptions);
  };

  const formatPickupTime = (isoString: string): string => {
    return dayjs(isoString).format('YYYY.MM.DD HH:mm');
  };

  // event handler: 이미지 클릭 이벤트 핸들러 //
  const onStoreImageClickHandler = () => {
    const { current } = storeUrlInputRef;
    if (!current) return;
    current.click();
};

  // event handler: 주문하기 버튼 클릭 이벤트 핸들러 //
  const onOrderClickHandler = async () => {
    const accessToken = cookies[ACCESS_TOKEN];

    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다.");
      navigator(LOGIN_PATH);
      return;
    }

    const userId = signInUser?.userId;
    if (!userId) {
      alert("사용자 정보가 확인되지 않습니다.");
      return;
    }

    if (!selectedDate || !isChecked || selectedOptions.some(item => !item.value)) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const pickupTime = formatPickupTime(selectedDate.toISOString());

    const orderRequestBody: PostOrderRequestDto = {
      pickupTime,
      productCount: cakeCount,
      productContents: request,
      totalPrice: finalPrice,
      options: selectedOptions.map(option => ({
        optionCategoryNumber: option.optionCategoryNumber
      }))
    };

    try {
      // 주문 요청 전송
      if (storeNumber && productNumber && userId) {
        const response = await postOrderRequest(orderRequestBody, userId, storeNumber, productNumber, accessToken);
        if (response.code === 'SU') {
          alert("주문이 완료되었습니다.");
          if (storeNumber) navigator(ST_ORDER_DONE_ABSOLUTE_PATH(storeNumber));
        } else {
          alert(response.message || "주문에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("주문 요청 오류:", error); // 오류 로그
      alert("서버 오류로 주문을 처리할 수 없습니다.");
    }
  };

  // effect: 상품 상세 정보 가져오기 //
  useEffect(getProductDetail, []);

  // effect: 상품 최종 금액 업데이트 //
  useEffect(() => {
    const basePrice = price; // 상품 기본 가격
    const optionPrice = selectedOptions.reduce((sum, selectedOption) => sum + selectedOption.price, 0);
    setFinalPrice(basePrice + optionPrice);
  }, [selectedOptions, price]);

  // render: 주문 상세 페이지 렌더링 //
  return (
    <div id='product-order'>
      <div className='photo-zone'>
        <div className='arrow-left' onClick={handlePrevImage}></div>
        <div className='image-box' style={{ display: "flex", flexDirection: "column" }}>
          <div className='images' style={{ backgroundImage: `url(${showCurrentImage()})`, backgroundSize: 'cover', backgroundRepeat: "no-repeat" }}></div>
          <div className='preview-box'>
            {imageList.length > 0 ? imageList.map((image, index) => <Previews key={index} imageUrl={image} onClick={() => handlePreviewClick(index)} />) : ''}
          </div>
        </div>
        <div className='arrow-right' onClick={handleNextImage}></div>
      </div>

      <div className='order-page'>
        <div>
          <div className='text'>케이크 주문서 작성</div>
          <hr className='custom-hr' />
          <div style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
            <div className={
              productTag === '포토' ? 'productTag-icon-photo' :
                productTag === '레터링' ? 'productTag-icon-letter' :
                  productTag === '한입 케이크' ? 'productTag-icon-oneBite' :
                    productTag === '도시락 케이크' ? 'productTag-icon-obento' :
                      productTag === '이단 케이크' ? 'productTag-icon-twoFloor' :
                        productTag === '비건 케이크' ? 'productTag-icon-vegun' :
                          productTag === '떡 케이크' ? 'productTag-icon-riceCake' : ''
            }></div>
            <div className='cake-name'>{cakeName}</div>
          </div>
          <div className='thema-zone'>
            {themaList.length > 0 ? themaList.map((thema, index) => <Tags key={index} contents={thema} />) : ''}
          </div>
          <div className='cake-introduce'>{introduce}</div>
          <div className='cake-price'>가격 {formatNumberWithCommas(price)}원</div>
        </div>

        <div className='pickup-date'>
          <div className='option-title'>픽업 일시 선택<span style={{ color: "red" }}>*</span></div>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            timeCaption="Time"
            dateFormat="yyyy년 MM월 dd일 h:mm aa"
            placeholderText="날짜와 시간을 선택하세요"
            filterTime={filterTime}
            filterDate={filterDate}
            dayClassName={(date) => 
              dayjs(date).isSame(dayjs(), 'day') ? '' : 'non-highlighted'
            }
          />
        </div>

        {options.map((option, index) =>
          <div key={index} className='pick-size' style={{ marginBottom: "25px" }}>
            <div className='option-title'>{option.productOptionName} 선택{(option.productOptionName === '맛' || option.productOptionName === '크기') && <span style={{ color: "red" }}>*</span>}</div>
            <div className='radio-group' style={{ marginTop: "15px" }}>
              {option.optionDetails.map((optionDetail, index) =>
                <RadioButtonGroup key={index} name={option.productOptionName} value={optionDetail.productCategory} price={optionDetail.productOptionPrice}
                  selectedOptions={selectedOptions} onSelect={onOptionSelectHandler} optionCategoryNumber={optionDetail.optionCategoryNumber} />
              )}
            </div>
          </div>
        )}

        <div>
          <div className='option-title'>요청사항</div>
          <textarea className='textarea' placeholder='자유롭게 입력하세요.' onChange={onRequestChangeHandler} />
        </div>

        {productTag === '포토' ?
          <div style={{marginTop: "20px", display: "flex", flexDirection: "column"}}>
            <div className='option-title'>사진 첨부<span style={{ color: "red" }}>*</span></div>
            <div className='cake-photo-zone'>
              <div className='cake-photo-pre'></div>
              <div className='cake-photo-file-pick' onClick={onStoreImageClickHandler}>파일 선택</div>
            </div>
          </div>
        : ''}
        

        <div style={{ display: "flex", flexDirection: "column", marginTop: "20px" }}>
          <div className='option-title'>유의사항 확인<span style={{ color: "red" }}>*</span></div>
          <div style={{ marginTop: "20px", whiteSpace: 'pre-line' }}>{caution}</div>
          <label className='checkbox'>
            <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
            상기의 내용을 확인하였으며, 불이익시 가게가 책임지지 않음에 동의합니다.
          </label>
        </div>

        <div className='total-price'>최종 금액 {formatNumberWithCommas(finalPrice)} 원</div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "35px" }}>
          <div className='order-button' onClick={onOrderClickHandler}>주문하기</div>
        </div>
      </div>
    </div>
  )
}