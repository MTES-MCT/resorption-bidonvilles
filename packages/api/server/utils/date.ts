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

function getMonthDiffBetween(d1: Date, d2: Date): number {
    return (d2.getMonth() - d1.getMonth()) + ((d2.getFullYear() - d1.getFullYear()) * 12);
}

function substractWeek(date) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 7);
    return newDate;
}

/**
 * Converts a date (string or Date object) to a timestamp in milliseconds
 * Used for actions and general purpose timestamp conversion
 *
 * @param date - Date as string or Date object, or null
 * @returns Timestamp in milliseconds, or null if input is null
 */
function toTimestamp(date: string | Date | null): number | null {
    if (date === null) {
        return null;
    }

    if (typeof date === 'string') {
        return new Date(date).getTime();
    }

    return date.getTime();
}

/**
 * Converts a date string to a timestamp in seconds (UTC midnight)
 * Used for shantytowns DATEONLY fields (declared_at, built_at, etc.)
 * Adds T00:00:00Z to ensure UTC midnight interpretation for strings
 *
 * @param date - Date as string (YYYY-MM-DD format) or Date object, or null
 * @returns Timestamp in seconds, or null if input is null
 */
function toTimestampSeconds(date: string | Date | null): number | null {
    if (date === null) {
        return null;
    }

    if (typeof date === 'string') {
        return new Date(`${date}T00:00:00Z`).getTime() / 1000;
    }

    return date.getTime() / 1000;
}

function normalizeDateToMidnight(date: Date | string): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function isOutOfDate(date: Date | string, thresholdInMonths: number): boolean {
    const now = new Date();
    const targetDate = new Date(date);

    const diffInMs = now.getTime() - targetDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const diffInMonths = diffInDays / 30;

    return diffInMonths >= thresholdInMonths;
}

export default {
    formatDate,
    substractWeek,
    toString,
    toFormat,
    fromTsToFormat,
    getMonthDiffBetween,
    toTimestamp,
    toTimestampSeconds,
    normalizeDateToMidnight,
    isOutOfDate,
};
