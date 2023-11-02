import dateUtils from '#server/utils/date';

const { toFormat, getMonthDiffBetween } = dateUtils;
type Row = {
    month: string;
    year: string;
    total: string;
};

type Result = {
    month: string;
    total: number;
};

// Convert rows which contains month/year to a mapping
// 2020-01-01 => x, 2020-01-02 => y
export default (rows: Row[], startDate: Date): Result[] => {
    const now = new Date();
    const result: Result[] = [];
    const monthsDiff = getMonthDiffBetween(startDate, now);

    for (let i = 1; i <= monthsDiff; i += 1) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const row = rows.find(({ month, year }) => parseInt(month, 10) === date.getMonth() + 1 && parseInt(year, 10) === date.getFullYear());
        result.unshift({
            month: toFormat(date, 'M Y'),
            total: row !== undefined ? parseInt(row.total, 10) : 0,
        });
    }

    return result;
};
