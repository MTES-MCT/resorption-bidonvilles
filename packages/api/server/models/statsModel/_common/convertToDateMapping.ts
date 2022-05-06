import dateUtils from '#server/utils/date';

const { toFormat, getMonthDiffBetween } = dateUtils;

// Convert rows which contains month/year to a mapping
// 2020-01-01 => x, 2020-01-02 => y
export default (rows, startDate) => {
    const now = new Date();
    const result = [];
    const monthsDiff = getMonthDiffBetween(startDate, now);

    for (let i = 1; i <= monthsDiff; i += 1) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const row = rows.find(({ month, year }) => parseInt(month, 10) === date.getMonth() + 1 && year === date.getFullYear());
        result.unshift({
            month: toFormat(date, 'M Y'),
            total: row !== undefined ? row.total : 0,
        });
    }

    return result;
};
