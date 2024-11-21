import React, { useRef, useState } from 'react'
import './style.css';
import KeywordCloud from '../../components/keyword';

// component: 메인 페이지 컴포넌트 //
export default function Home() {
    const readerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const [visibleSections, setVisibleSections] = useState([false, false, false]);

    const scrollToReader = () => {
        if (readerRef.current) {
            readerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToSection = () => {
        if (sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const onAnswerButtonClickHandler = (index: number) => {
        const newVisibleSections = [...visibleSections];
        newVisibleSections[index] = !newVisibleSections[index];
        setVisibleSections(newVisibleSections);
    };


    // render: 메인 페이지 컴포넌트 렌더링 //
    return (
        <div className='home'>
            <header>
                <div id='home-background'></div>
                <section>
                    <h1 className='home-title'>
                        <span>Since 2024</span>
                        <span style={{ fontFamily: 'Logofont' }}>The Memorial Day</span>
                    </h1>
                    <div className='home-arrow' onClick={scrollToSection}>현재 인기 키워드 바로 확인하기</div>
                </section>
            </header>

            <section ref={readerRef} className="reader" id="read">
                <div className="content">
                    <div data-split aria-hidden="true">
                        <h1 style={{ fontSize: '50px' }} className='reader-content-comment'>
                            당신의 특별한 일상이 더욱 특별해지길
                        </h1>
                    </div>
                    <div style={{ fontSize: '18px' }}>생일, 연인 기념일, 브라이덜 샤워, 팔순 잔치 등
                        소중한 사람들과 보내는 시간을 더욱 특별하게 만들어 보세요 :)</div>
                    <div className='how-question'>
                        <div className='how-question-a'>
                            <div className='question-answer'>
                                ❤️ 케이크 주문은 어떻게 하나요?
                                <div className='how-answer-button' onClick={() => onAnswerButtonClickHandler(0)} />
                            </div>
                            {visibleSections[0] && (
                                <div className='how-answer'>
                                    <div>첫째. 상단의 STORES 카테고리에 들어가주세요.</div>
                                    <div>둘째. 자유롭게 둘러보시고 원하는 가게와 케이크를 선택해주세요.</div>
                                    <div>셋째. 양식에 맞추어 주문서를 작성하고 주문하기 버튼을 눌러주세요.</div>
                                    <div>넷째. 마이페이지에서 승인 상태를 확인한 후, 결제를 마치면 주문이 완료됩니다. </div>
                                </div>
                            )}
                        </div>
                        <div className='how-question-b'>
                            <div className='question-answer'>
                                ❤️ 가게 등록은 어떻게 하나요?
                                <div className='how-answer-button' onClick={() => onAnswerButtonClickHandler(1)} />
                            </div>
                            {visibleSections[1] && (
                                <div className='how-answer'>
                                    <div>첫째. 상단의 JOIN 카테고리에 들어가주세요.</div>
                                    <div>둘째. 사업자 등록을 위해 필요한 정보를 입력해주세요.</div>
                                    <div>셋째. 등록 버튼을 눌러주세요.</div>
                                    <div>넷째. 승인 완료를 기다려주세요.</div>
                                </div>
                            )}
                        </div>
                        <div className='how-question-c'>
                            <div className='question-answer'>
                                ❤️ 서비스에 관한 추가 질문은 어떻게 하나요?
                                <div className='how-answer-button' onClick={() => onAnswerButtonClickHandler(2)} />
                            </div>
                            {visibleSections[2] && (
                                <div className='how-answer'>
                                    <div>첫째. 상단의 SUPPORT 카테고리에 들어가주세요.</div>
                                    <div>둘째. 이미 안내되어 있는 질문일 수 있으니, NOTICE를 확인해주세요.</div>
                                    <div>셋째. 기타 질문이 있으시다면 Q&A를 통해 언제든지 질문을 남겨주세요.</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section ref={sectionRef}>
                <KeywordCloud />
            </section>

            <a className='go-to-stores' href='/stores' >지금 바로 둘러보기</a>
        </div>
    );
}