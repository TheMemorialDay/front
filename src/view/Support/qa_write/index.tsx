import React, { ChangeEvent, useState } from 'react'
import SupportNavi from '../../../components/support_navi'
import './style.css';
import { useNavigate } from 'react-router-dom';
import { SU_ABSOLUTE_QA_PATH } from '../../../constants';

export default function QaWrite() {

    // state: 제목 상태 //
    const [subject, setSubjact] = useState<string>('');
    // state: 내용 상태 //
    const [script, setScript] = useState<string>('');

    // function: 네비게이터 //
    const navigator = useNavigate();

    // event handler: 제목 입력 상태 //
    const onSubjectChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSubjact(value);
    };

    // event handler: 내용 입력 상태 //
    const onScriptChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setScript(value);
    };

    // event handler: 큐엔에이 작성 취소 버튼 //
    const onWriteCancleButtonHandler = () => {
        navigator(SU_ABSOLUTE_QA_PATH);
    };

    // event handler: 큐엔에이 등록 버튼 //
    //* api 작성 후 다시 작성 
    const onWriteRegisterButtonHandler = () => {
        alert('등록이 완료되었습니다.');
        navigator(SU_ABSOLUTE_QA_PATH);
    };

    return (
        <div id='qa-write-wrapper'>
            <SupportNavi />
            <div className='top'>
                <div className='subject'>제목</div>
                <input value={subject} type='text' placeholder='제목을 입력해주세요.' onChange={onSubjectChangeHandler} />
            </div>
            <div className='main'>
                <div className='script'>내용</div>
                <input
                    value={script}
                    type='text'
                    placeholder='내용(공백 포함 최소 15글자 입니다.)'
                    onChange={onScriptChangeHandler}
                    minLength={15}
                />
            </div>
            <div className='bottom'>
                <div className='button cancle-button' onClick={onWriteCancleButtonHandler}>취소</div>
                <div className='button write-button' onClick={onWriteRegisterButtonHandler}>등록</div>
            </div>
        </div>
    )
}
