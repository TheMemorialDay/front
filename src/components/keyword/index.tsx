import React, { useEffect, useState } from 'react';
import { KeywordData } from '../../apis/dto/response/keyword/get-keyword-list.response';
import { getKeywordListRequest } from '../../apis';

const KeywordCloud = () => {
    const [keywords, setKeywords] = useState<KeywordData[]>([]);

    useEffect(() => {
        getKeywordListRequest().then(data => {
            if (data) setKeywords(data.keywords);
        });
    }, []);

    const getFontSize = (frequency: number) => `${Math.min(2 + frequency * 0.3, 4)}rem`;
    const getColor = () => `hsl(${Math.random() * 360}, 70%, 85%)`; // 랜덤 파스텔톤 색상

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '2rem' }}>
            {keywords.map(({ keyword, frequency }) => (
                <span
                    key={keyword}
                    style={{
                        fontSize: getFontSize(frequency),
                        color: getColor(),
                        fontWeight: 'bold',
                    }}
                >
                    #{keyword}
                </span>
            ))}
        </div>
    );
};

export default KeywordCloud;
