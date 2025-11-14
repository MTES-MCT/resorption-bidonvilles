import dateToString from "./dateToString";

export default function (date) {
    if (!date || !(date instanceof Date)) {
        return date;
    }

    return dateToString(date);
}
