export default function (int) {
    if (typeof int === "number") {
        return `${int}`;
    }

    return undefined;
}
