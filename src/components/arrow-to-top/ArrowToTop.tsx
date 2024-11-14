import React, { useRef, useEffect, useState } from "react";
import './ArrowToTop.css';
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default function ArrowToTop() {
    const scrollTopRef = useRef<HTMLDivElement | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [recommendedText, setRecommendedText] = useState("Gemini 레터링 추천을 불러오는 중...");
    const [topic, setTopic] = useState<"생일" | "전역" | "프로포즈" | "합격" | null>(null);
    const [target, setTarget] = useState<"친구" | "가족" | "연인" | "동료" | null>(null);
    const [chatMessages, setChatMessages] = useState<{ text: string, sender: "bot" | "user" }[]>([
        { text: "주제를 먼저 골라주세요.", sender: "bot" }
    ]);
    const [loading, setLoading] = useState(false);

    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY as string);
    const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsChatOpen(false);
            }
        }

        if (isChatOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isChatOpen]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    async function fetchRecommendation(regenerate = false) {
        setLoading(true);
        try {
            let prompt;
            if (topic === "프로포즈") {
                // 프로포즈에 대한 프롬프트 처리
                prompt = regenerate
                    ? `${topic} 인 상황에서, 상대에게 줄 케이크 레터링 문구 30자 이내로 5개, 앞의 대답들과 절대 겹치지 않게 추천해줘. 결과를 Plain Text 형태로 반환하고, 마크다운 문법 제발 쓰지 말고 한국어로 대답해줘.`
                    : `${topic} 인 상황에서, 상대에게 줄 케이크 레터링 문구 30자 이내로 5개 추천해줘. 결과를 Plain Text 형태로 반환하고, 마크다운 문법 제발 쓰지 말고 한국어로 대답해줘.`;
            } else {
                // 다른 주제에 대한 기존 프롬프트 처리
                prompt = regenerate
                    ? `${topic} 인 상황에서, ${target} 에게 줄 케이크 레터링 문구 30자 이내로 5개, 앞의 대답들과 절대 겹치지 않게 추천해줘. 결과를 Plain Text 형태로 반환하고, 마크다운 문법 제발 쓰지 말고 한국어로 대답해줘.`
                    : `${topic} 인 상황에서, ${target} 에게 줄 케이크 레터링 문구 30자 이내로 5개 추천해줘. 결과를 Plain Text 형태로 반환하고, 마크다운 문법 제발 쓰지 말고 한국어로 대답해줘.`;
            }

            const result = await geminiModel.generateContent(prompt);
            const { response } = result;
            let text = response.text();

            text = text.replaceAll('#', '').replaceAll('*', '').replace(/\s?(\d\.)/g, (_match: any, p1: any, offset: number) => (offset === 0 ? p1 : `<br /><br />${p1}`));
            setRecommendedText(text);
            setChatMessages([...chatMessages, { text, sender: "bot" }]);
        } catch (error) {
            setRecommendedText("추천 문구 생성 오류");
            console.error("Gemini API 오류:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (topic && (target || topic === "프로포즈")) {
            fetchRecommendation();
        }
    }, [topic, target]);

    const handleTopicSelect = (selectedTopic: "생일" | "전역" | "프로포즈" | "합격") => {
        setTopic(selectedTopic);
        if (selectedTopic === "프로포즈") {
            // 프로포즈 주제는 바로 추천을 요청하고, 타겟 선택 없이 진행
            fetchRecommendation();
            setChatMessages([
                ...chatMessages,
                { text: selectedTopic, sender: "user" },
                { text: "레터링 추천 문구가 생성되었습니다.", sender: "bot" }
            ]);
        } else {
            // 다른 주제는 타겟 선택이 필요하도록 메시지 추가
            setChatMessages([
                ...chatMessages,
                { text: selectedTopic, sender: "user" },
                { text: "대상을 선택해주세요.", sender: "bot" }
            ]);
        }
    };

    const handleTargetSelect = (selectedTarget: "친구" | "가족" | "연인" | "동료") => {
        setTarget(selectedTarget);
        setChatMessages([...chatMessages, { text: selectedTarget, sender: "user" }]);
    };

    const toggleChat = () => setIsChatOpen(!isChatOpen);

    const regenerateResponse = () => {
        if (topic) {
            fetchRecommendation(true);
        }
    };

    const resetChat = () => {
        setTopic(null);
        setTarget(null);
        setChatMessages([{ text: "주제를 먼저 골라주세요.", sender: "bot" }]);
    };

    return (
        <>
            <div id="arrow-to-top" ref={scrollTopRef} onClick={scrollToTop}>
                <img
                    src={`${process.env.PUBLIC_URL}/images/upPageButton.png`}
                    alt="Scroll to Top"
                    className="arrow-to-top-image"
                    style={{ cursor: "pointer" }}
                />
            </div>
            <div className="gemini-chat-button" onClick={toggleChat}>
                <img
                    src="https://lh3.googleusercontent.com/Xtt-WZqHiV8OjACMMMr6wMdoMGE7bABi-HYujupzevufo1kiHUFQZukI1JILhjItrPNrDWLq6pfd=s600-w600"
                    alt="Gemini Chat Icon"
                    className="gemini-chat-icon"
                />
                <span className="gemini-chat-tooltip">AI의 케이크 레터링 문구 추천!</span>
            </div>

            {isChatOpen && (
                <div className="gemini-chat-modal" ref={modalRef}>
                    <div className="chat-content">
                        {chatMessages.map((message, index) => (
                            <div key={index} className={`chat-bubble ${message.sender}`}>
                                <span
                                    className="chat-text"
                                    dangerouslySetInnerHTML={{ __html: message.text }}
                                ></span>
                                {message.sender === "bot" && (
                                    <img
                                        src="https://lh3.googleusercontent.com/Xtt-WZqHiV8OjACMMMr6wMdoMGE7bABi-HYujupzevufo1kiHUFQZukI1JILhjItrPNrDWLq6pfd=s600-w600"
                                        alt="Bot"
                                        className="chat-profile-pic bot-profile"
                                    />
                                )}
                                {message.sender === "user" && (
                                    <img
                                        src="https://www.ibossedu.co.kr/template/DESIGN_shared/program/theme/01/THUMBNAIL_60_60_icon_rep_box.gif"
                                        alt="User"
                                        className="chat-profile-pic"
                                    />
                                )}
                            </div>
                        ))}
                        {!topic && (
                            <div className="button-group">
                                <button onClick={() => handleTopicSelect("생일")}>생일</button>
                                <button onClick={() => handleTopicSelect("전역")}>전역</button>
                                <button onClick={() => handleTopicSelect("프로포즈")}>프로포즈</button>
                                <button onClick={() => handleTopicSelect("합격")}>합격</button>
                            </div>
                        )}
                        {topic && !target && topic !== "프로포즈" && (
                            <div className="button-group">
                                <button onClick={() => handleTargetSelect("친구")}>친구</button>
                                <button onClick={() => handleTargetSelect("가족")}>가족</button>
                                <button onClick={() => handleTargetSelect("연인")}>연인</button>
                                <button onClick={() => handleTargetSelect("동료")}>동료</button>
                            </div>
                        )}
                        {loading && (
                            <div className="loading">
                                <div className="spinner"></div>
                                <span>AI가 답변을 생성 중입니다...</span>
                            </div>
                        )}
                    </div>
                    {topic && (target || topic === "프로포즈") && (
                        <div className="action-buttons">
                            <button onClick={regenerateResponse} className="rounded-button regenerate-chat">
                                답변 다시 생성하기
                            </button>
                            <button onClick={resetChat} className="rounded-button reset-chat">
                                처음부터 시작하기
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
