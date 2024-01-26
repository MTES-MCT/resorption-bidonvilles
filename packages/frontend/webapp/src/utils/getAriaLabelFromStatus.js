export default function (status) {
    switch (status) {
        case "good":
            return "Bonnes conditions";

        case "bad":
            return "Mauvaises conditions";

        case "unknown":
            return "Conditions inconnues";

        case "toImprove":
            return "Conditions à améliorer";

        default:
            return null;
    }
}
