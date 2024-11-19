import React from 'react';

    const maskString = (str: string): string => {
        if (str.length <= 4) return str; // 2길이가 4 이하일 때는 마스킹할 필요가 없음
        const start = str.slice(0, 2); // 앞 2글자
        const end = str.slice(-2); // 뒤 2글자
        const middle = '*'.repeat(str.length - 4); // 중간 글자만큼 *
        return start + middle + end;
    };

export default maskString;


