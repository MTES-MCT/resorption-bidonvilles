const MONTHS = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
];

/**
 *
 * @param num adds a leading zero to the month, the day, the hours, the minutes or seconds
 *            if it only contains a single digit (when value is less than 10)
 * @returns num: number
 */
function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
}

function formatDate(date: Date) {
    return (
        `${[
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-')
        } ${
            [
                padTo2Digits(date.getHours()),
                padTo2Digits(date.getMinutes()),
                padTo2Digits(date.getSeconds()),
            ].join(':')}`
    );
}

function toString(date, showHours = false) {
    const str = `${`${date.getDate()}`.padStart(2, '0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

    if (showHours !== true) {
        return str;
    }

    return `${str} à ${`${date.getHours()}`.padStart(2, '0')}h${`${date.getMinutes()}`.padStart(2, '0')}`;
}

function toFormat(date, format) {
    return format
        .replace(/d/g, `${date.getDate()}`.padStart(2, '0'))
        .replace(/Y/g, date.getFullYear())
        .replace(/m/g, `${date.getMonth() + 1}`.padStart(2, '0'))
        .replace(/h/g, `${date.getHours()}`.padStart(2, '0'))
        .replace(/i/g, `${date.getMinutes()}`.padStart(2, '0'))
        .replace(/M/g, MONTHS[date.getMonth()]);
}

function fromTsToFormat(ts, format) {
    if (!ts) {
        return ts;
    }

    return toFormat(new Date(ts * 1000), format);
}

function getMonthDiffBetween(d1, d2) {
    return (d2.getMonth() - d1.getMonth()) + ((d2.getFullYear() - d1.getFullYear()) * 12);
}

function substractWeek(date) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 7);
    return newDate;
}

export default {
    formatDate,
    substractWeek,
    toString,
    toFormat,
    fromTsToFormat,
    getMonthDiffBetween,
};
