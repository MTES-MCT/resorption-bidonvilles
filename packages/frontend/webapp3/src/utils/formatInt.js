export default function (int, nullValue = "NC") {
    if (int === undefined || int === null) {
        return nullValue;
    }

    return int;
}
