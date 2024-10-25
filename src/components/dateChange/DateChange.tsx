import { format, parseISO } from 'date-fns';

const formatDate = (dateStr: string): string => {
    const parsedDate = parseISO(dateStr);
    return format(parsedDate, 'yyyy-MM-dd');
};

// 사용 예시
// const dateStr = "2024-10-22T15:00:00.000+00:00";
// const formattedDate = formatDate(dateStr);

// console.log(formattedDate); // 2024-10-22

export default formatDate;