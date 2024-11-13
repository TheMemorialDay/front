import React, { useEffect, useState } from 'react';
import { GetHotThemeResponseDto, GetKeywordResponseDto } from '../../apis/dto/response/home';
import { ResponseDto } from '../../apis/dto/response';
import { getKeywordRequest, getThemeRequest } from '../../apis';
import { KeywordComponentProps, ThemeComponentProps } from '../../types';
import ReactWordcloud, { OptionsProp } from 'react-wordcloud';

// component: 인기 키워드 컴포넌트 //
const KeywordCloud = () => {

        // state: 인기 키워드 상태 //
        const [keywordstate, setKeywordState] = useState<KeywordComponentProps[]>([]);

        // state: 인기 테마 상태 //
        const [themeState, setThemeState] = useState<ThemeComponentProps[]>([]);

        // state: 메시지 상태 //
        const [keywordMessage, setKeywordMessage] = useState<string>('');
        const [themeMessage, setThemeMessage] = useState<string>('');
    
        // function: 인기 키워드 불러오기 response 처리 함수 //
        const getKeywordResponse = (responseBody: GetKeywordResponseDto | ResponseDto | null) => {
            const message = 
                !responseBody ? '준비하여 보여드리겠습니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
    
            const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    
            if (!isSuccessed) {
                setKeywordMessage(message);
                return;
            }

            const { keywords } = responseBody as GetKeywordResponseDto;
            setKeywordState(keywords);
        };

        // function: 인기 테마 불러오기 response 처리 함수 //
        const getThemeResponse = (responseBody: GetHotThemeResponseDto | ResponseDto | null) => {
            const message = 
                !responseBody ? '준비하여 보여드리겠습니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
    
            const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    
            if (!isSuccessed) {
                setThemeMessage(message);
                return;
            }

            const { themas } = responseBody as GetHotThemeResponseDto;
            setThemeState(themas);
        };

        //* 인기 키워드를 위한 ==============================================================
        const keywords = keywordstate.map(keyword => ({
            text: '#'+(keyword.keyword), // 'text' 속성에 단어를 할당
            value: (keyword.cnt)*10,    // 'value' 속성에 해당 카운트를 할당
        }));

        const keyworda = themeState.map(theme => ({
            text: '#'+(theme.thema), // 'text' 속성에 단어를 할당
            value: (theme.cnt)*10,    // 'value' 속성에 해당 카운트를 할당
        }));

        const keywordb = [...keywords, ...keyworda];

    // effect: 마운트 될 시 키워드 불러오는 이펙트 //
    useEffect(() => {
        getKeywordRequest().then(getKeywordResponse);
        getThemeRequest().then(getThemeResponse);
    }, []);

    const callbacks = {
        onWordClick: console.log,
        onWordMouseOver: console.log,
        getWordTooltip: (word: { text: any; value: number; }) => `${word.text} (${word.value}) [${word.value > 50 ? "good" : "bad"}]`,
    }

    //* 색상 배열
    const colors = [
        '#C70039', '#AF47D2', '#2192FF', '#FFEB00',
        '#FF6701', '#FA4032', '#65B741', '#FF0080'
    ];

    // function: 색상 배열 랜덤 돌리기 //
    const getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

    const options: OptionsProp = {
        colors: Array.from({length: 100}, () => getRandomColor()),
        enableTooltip: false,
        deterministic: true,
        fontFamily: 'Montserrat',
        fontSizes: [40, 130],
        fontStyle: 'normal',
        // fontWeight: 'normal',
        padding: 3,
        rotations: 0, //旋转
        rotationAngles: [0, 10],
        scale: 'sqrt',
        spiral: 'archimedean',
        transitionDuration: 1000,
    };
    const size: [number, number] = [1200, 800];

    // render: 인기 키워드 컴포넌트 렌더링 //
    return (
        <div>
            <ReactWordcloud callbacks={callbacks} options={options} words={keywordb} size={size} />
        </div>
    );
};

export default KeywordCloud;
