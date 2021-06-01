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

module.exports = {
    toString,
    toFormat,
    fromTsToFormat,
    getMonthDiffBetween,
};
