export default function (bool) {
    if (bool === false) {
        return "non";
    }

    if (bool === true) {
        return "oui";
    }

    return "non communiqué";
}
