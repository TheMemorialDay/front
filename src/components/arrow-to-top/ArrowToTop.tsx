import React, { useRef, useEffect } from "react";
import './ArrowToTop.css';
// import arrowImage from '../../../public/images/upPageButton.png'

export default function ArrowToTop() {
    const scrollTopRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const scrollToTop = (e: MouseEvent) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        scrollTopRef.current?.addEventListener("click", scrollToTop);
        return () => scrollTopRef.current?.removeEventListener("click", scrollToTop);
    }, []);

    return (
        <div id="arrow-to-top">
            <img
                src={`${process.env.PUBLIC_URL}/images/upPageButton.png`}
                alt="Scroll to Top"
                className="arrow-to-top-image"
                ref={scrollTopRef}
                style={{ cursor: "pointer" }}  // 클릭 가능한 커서 스타일 추가
            />
        </div>
    );
}
