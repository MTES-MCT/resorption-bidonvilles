import formatDate from "./formatDate";

export default function (date) {
    if (!date || !(date instanceof Date)) {
        return date;
    }

    return formatDate(date.getTime() / 1000, 'y-m-d');
}
