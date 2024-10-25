import React, { ChangeEvent, useState } from 'react'
import './style.css'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import { ST_ORDER_DONE_ABSOLUTE_PATH } from '../../../../constants';


interface PreviewUrlProps {
  imageUrl: string;
}

interface ThemaProps {
  contents: string;
}

interface SizeProps {
  size: string;
  addPrice: string | number;
}

interface FlavorProps {
  flavor: string;
  addPrice: string | number;
}

// component: 사진 미리보기 컴포넌트 //
function Previews({imageUrl}: PreviewUrlProps) {

  //render: 사진 미리보기 렌더링 //
  return (
    <div id='preview' style={{backgroundImage: `url(${imageUrl})`}}></div>
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
        {size}{addPrice? `(+${addPrice})`: ''}
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
        {flavor}{addPrice? `(+${addPrice})`: ''}
      </label>
  );
};

// component: 상품 상세 페이지(주문 페이지)
export default function Order() {

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

  // render: 주문 상세 페이지 렌더링 //
    return (
        <div id='product-order'>
            <div className='photo-zone'>
                <div className='arrow-left'></div>
                <div className='image-box' style={{display: "flex", flexDirection: "column"}}>
                  <div className='images'></div>
                  <div className='preview-box'>
                    <Previews imageUrl='/star.png' />
                    <Previews imageUrl='/star.png' />
                    <Previews imageUrl='/star.png' />
                    <Previews imageUrl='/star.png' />
                  </div>
                </div>
                
                <div className='arrow-right'></div>
            </div>

            <div className='order-page'>
              <div>
                <div className='text'>케이크 주문서 작성</div>
                <hr className='custom-hr'/>
                <div className='cake-name'>보라빛 생화를 이용한 케이크</div>
                <div className='thema-zone'>
                    <Tags contents='#효도'/>
                    <Tags contents='#화려함'/>
                    <Tags contents='#신년'/>
                </div>
                <div className='cake-introduce'>
                  보라색 빛을 띄는 다양한 꽃들과 진주 모양을 한 초코 크런치로<br/>
                  고급스럽고 우아한 분위기를 연출한 케이크입니다.<br/>
                  30대 중반 이후로 인기가 많습니다.
                </div>
                <div className='cake-price'>가격 43,000</div>
              </div>
                
              <div className='pickup-date'>
                <div className='option-title'>1. 픽업 일시 선택<span style={{color: "red"}}>*</span></div>
                <CalendarInput />
              </div>

              <div className='pick-size'>
                <div className='option-title'>2. 사이즈 선택<span style={{color: "red"}}>*</span></div>
                <div className='radio-group' style={{marginTop: "15px"}}>
                  <RadioButtonGroupSize size='도시락 케이크' addPrice={''}/>
                  <RadioButtonGroupSize size='1호' addPrice={'5000'}/>
                  <RadioButtonGroupSize size='2호' addPrice={'10000'}/>
                  <RadioButtonGroupSize size='2단 케이크' addPrice={'20000'}/>
                </div>
              </div>

              <div className='pick-size' style={{marginTop: "30px"}}>
                <div className='option-title'>3. 맛 선택<span style={{color: "red"}}>*</span></div>
                <div className='radio-group' style={{marginTop: "15px"}}>
                  <RadioButtonGroupFlavor flavor='생크림' addPrice={''}/>
                  <RadioButtonGroupFlavor flavor='초코' addPrice={''}/>
                  <RadioButtonGroupFlavor flavor='쿠앤크' addPrice={''}/>
                  <RadioButtonGroupFlavor flavor='제철과일' addPrice={'5000'}/>
                </div>
              </div>

              <div className='pickup-date'>
                <div className='option-title'>4. 수량 입력<span style={{color: "red"}}>*</span></div>
                <div className='count-handler'>
                  <div className='count-up' onClick={onPlusClickHandler}></div>
                  <div style={{fontSize: "16px", cursor:"pointer"}}>{cakeCount}</div>
                  <div className='count-down' onClick={onMinusClickHandler}></div>
                </div>
              </div>

              <div>
                <div className='option-title'>5. 요청사항</div>
                <textarea className='textarea' placeholder='자유롭게 입력하세요.' onChange={onRequestChangeHandler}/>
              </div>

              <div style={{display:"flex", flexDirection:"column", marginTop: "20px"}}>
                <div className='option-title'>6. 유의사항 확인<span style={{color: "red"}}>*</span></div>
                <div style={{marginTop: "20px"}}>사장님이 적은 내용..~</div>
                <label className='checkbox'>
                  <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange}/>
                  상기의 내용을 확인하였으며, 불이익시 가게가 책임지지 않음에 동의합니다.
                  </label>
              </div>

              <div className='total-price'>최종 금액 {43000} 원</div>

              <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "35px"}}>
                <div className='order-button' onClick={onOrderClickHandler}>주문하기</div>
              </div>
        </div>
    </div>
  )
}
