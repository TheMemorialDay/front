import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, JO_OKAY_ABSOLUTE_PATH, ROOT_ABSOLUTE_PATH } from '../../constants';
import { PatchJoinRequestDto } from '../../apis/dto/request/join';
import { checkBusinessRequest, fileUploadRequest, patchJoinRequest } from '../../apis';
import { useCookies } from 'react-cookie';
import { ResponseDto } from '../../apis/dto/response';
import { useSignInUserStore } from '../../stores';
import BusinessCheckRequestDto from '../../apis/dto/request/join/business-check.request.dto';


// component: 사장 권한 등록 조인 화면 컴포넌트 //
export default function Join() {

    // state: 쿠키 상태 //
    const [cookies] = useCookies();

    // state: 로그인 유저 상태 //
    const {signInUser} = useSignInUserStore();

    // state: 상태 변수 //
    const [businessNumber, setbusinessNumber] = useState<string>('');
    const [isMatched, setIsMatched] = useState<boolean>(false);
    const [openDate, setOpenDate] = useState<string>('');
    const [isMatched2, setIsMatched2] = useState<boolean>(false);

    // state: 사업자 등록 파일 상태 //
    const [fileName, setFileName] = useState<string>('');
    const pdfInputRef = useRef<HTMLInputElement | null>(null);
    const [businessFile, setBusinessFile] = useState<File | null>(null);
    const [sendUrl, setSendUrl] = useState<string | null>('');

    let url: string | null = null;

    // function: 네비게이션 함수 //
    const navigator = useNavigate();

    // function: business check response 함수 //
    const businessCheckResponse = (responseBody: string | null | ResponseDto) => {
        const message = 
            !responseBody ? "서버에 문제가 있습니다." :
            responseBody === "01" ? "인증 완료" :
            responseBody === "02" ? "유효하지 않은 정보입니다." : responseBody;
        
        const isSuccessed = responseBody !== null && responseBody === "01";
        if(!isSuccessed) {
            alert(message);
            return;
        }

        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken) return;

        console.log("send file: " + url);
        if(signInUser?.userId && url) {
            const requestBody: PatchJoinRequestDto = {
                businessNumber,
                businessOpendate: openDate,
                permission: "사장",
                businessUrl: url
            };
            console.log(requestBody);
            patchJoinRequest(requestBody, signInUser.userId, accessToken).then(patchJoinResponse);
        }
    }

    // function: patch join response 처리 함수 //
    const patchJoinResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.12' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.': '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if(!isSuccessed) {
            alert(message);
            return;
        }
        navigator(JO_OKAY_ABSOLUTE_PATH);
    }

    // event handler: 사업자 등록 번호 변경 이벤트 핸들러 //
    const onbusinessNumber = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;

        const pattern = /^[0-9]{10}$/;
        const isTrue = pattern.test(value);
        setIsMatched(isTrue);
        setbusinessNumber(value);
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
        if (file?.type === "application/pdf") {
            setFileName(file.name); // 파일 이름 상태 업데이트
            setBusinessFile(file);
        }else return;
        
    };

    // event handler: 개업일자 변경 이벤트 핸들러 //
    const onOpenDateChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        const pattern = /^[0-9]{8}$/;
        const isTrue = pattern.test(value);
        setIsMatched2(isTrue);
        setOpenDate(value);
    }

    // event handler: 취소 버튼 클릭 이벤트 핸들러 //
    const onCancleButtonClickHandler = () => {
        navigator(ROOT_ABSOLUTE_PATH);
        
    }

    // event handler: 등록 버튼 클릭 이벤트 핸들러 //
    const onResigterButtonClickHandler = async() => {
        if(!businessNumber  || !openDate || !fileName) {
            alert('모두 입력해주세요.');
            return;
        } else if(!isMatched || !isMatched2) {
            alert('정확하게 입력해주세요.');
            return;
        }

        
        if(businessFile) {
            const formData = new FormData();
            formData.append('file', businessFile);
            url = await fileUploadRequest(formData);
            console.log("selected file: " + url);
            //setSendUrl(url);
        }

        if(signInUser && url) {
            console.log(signInUser);
            const requestBody: BusinessCheckRequestDto = {
                businesses: [
                    {
                        b_no: businessNumber,
                        start_dt: openDate,
                        p_nm: signInUser.name,
                        p_nm2: "",
                        b_nm: "",
                        corp_no: "",
                        b_sector: "",
                        b_type: ""
                    }
                ]
            }
            console.log(requestBody);
            const accessToken = cookies[ACCESS_TOKEN];
            if(!accessToken) return;
            checkBusinessRequest(requestBody).then(businessCheckResponse);
        }
    }

    // render: 사장 권한 등록 조인 화면 렌더링 //
    return (
        <div id='join'>
            <div className='top'>
                <div style={{marginBottom:"2px"}}>사장님의 소중한</div>
                <div>가게를 등록해주세요!</div>
            </div>

            <div className='business'>
                <input className='register-number' placeholder='사업자 등록 번호' maxLength={10} value={businessNumber} onChange={onbusinessNumber}/>
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
                <input className='open-date' placeholder='개업 일자(YYYYMMDD)' maxLength={8} value={openDate} onChange={onOpenDateChangeHandler}/>
            </div>

            <div className='button-box'>
                <div className='button-cancle' onClick={onCancleButtonClickHandler}>취소</div>
                <div className='button-register' onClick={onResigterButtonClickHandler}>등록</div>
            </div>
        </div>
    )
}
