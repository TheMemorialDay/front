import React, { ChangeEvent, useRef, useState } from 'react'
import './style.css';
import { useNavigate } from 'react-router-dom';
import { JO_OKAY_ABSOLUTE_PATH, ROOT_ABSOLUTE_PATH } from '../../constants';

// component: 사장 권한 등록 조인 화면 컴포넌트 //
export default function Join() {

    // state: 상태 변수 //
    const [bussinessNumber, setBussinessNumber] = useState<string>('');
    const [isMatched, setIsMatched] = useState<boolean>(false);

    // state: 사업자 등록 파일 상태 //
    const [fileName, setFileName] = useState<string>('');
    const pdfInputRef = useRef<HTMLInputElement | null>(null);

    // function: 네비게이션 함수 //
    const navigator = useNavigate();

    // event handler: 사업자 등록 번호 변경 이벤트 핸들러 //
    const onBussinessNumber = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;

        const pattern = /^[0-9]{10}$/;
        const isTrue = pattern.test(value);
        setIsMatched(isTrue);
        setBussinessNumber(value);
    }

    // event handler: 파일 선택 버튼 클릭 이벤트 핸들러 //
    const onUploadButtonClickHandler = () => {
        const {current} = pdfInputRef;
        if(!current) return;
        current.click();
    }

     // event handler: 파일 선택 시 파일 이름 설정 //
     const onFileChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // 선택한 파일
        if (file) {
            setFileName(file.name); // 파일 이름 상태 업데이트
        }
    };

    // event handler: 취소 버튼 클릭 이벤트 핸들러 //
    const onCancleButtonClickHandler = () => {
        navigator(ROOT_ABSOLUTE_PATH);
    }

    // event handler: 등록 버튼 클릭 이벤트 핸들러 //
    const onResigterButtonClickHandler = () => {
        if(!bussinessNumber || !fileName) {
            alert('모두 입력해주세요.');
            return;
        } else if(!isMatched) {
            alert('정확하게 입력해주세요.');
            return;
        }

        navigator(JO_OKAY_ABSOLUTE_PATH);
    }

    // render: 사장 권한 등록 조인 화면 렌더링 //
    return (
        <div id='join'>
            <div className='top'>
                <div style={{marginBottom:"2px"}}>사장님의 소중한</div>
                <div>가게를 등록해주세요!</div>
            </div>

            <div className='bussiness'>
                <input className='register-number' placeholder='사업자 등록 번호' maxLength={10} value={bussinessNumber} onChange={onBussinessNumber}/>
                <div className='file-box'>

                    <input
                        type="file"
                        ref={pdfInputRef}
                        style={{ display: 'none' }} // 숨김 처리
                        accept="application/pdf" // PDF 파일만 선택 가능
                        onChange={onFileChangeHandler}
                    />
                    <input
                        className='register-file'
                        placeholder='선택된 파일 이름'
                        value={fileName}
                        readOnly
                    />
                    <div className='file-button' onClick={onUploadButtonClickHandler}>파일 선택</div>
                </div>
            </div>

            <div className='button-box'>
                <div className='button-cancle' onClick={onCancleButtonClickHandler}>취소</div>
                <div className='button-register' onClick={onResigterButtonClickHandler}>등록</div>
            </div>
        </div>
    )
}
