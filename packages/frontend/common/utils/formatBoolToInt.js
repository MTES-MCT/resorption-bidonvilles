export default function (bool) {
    if (bool === undefined) {
        return undefined;
    }

    if (bool === true) {
        return 1;
    }

    if (bool === false) {
        return 0;
    }

    return -1;
}
