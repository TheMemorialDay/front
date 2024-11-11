import axios from 'axios';

export const getSalesRequest = (accessToken: string) => {
    return axios.get('/mypage/sales', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    }).then(response => response.data)
        .catch(error => {
            console.error('매출 데이터 요청 오류:', error);
            throw error;
        });
};
