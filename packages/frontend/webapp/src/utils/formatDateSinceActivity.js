import getSince from "./getSince";

export default function formatDateSinceActivity(ts) {
    const { days, months, weeks } = getSince(ts);

    if (months === 0) {
        if (days === 0) {
            return `aujourd'hui`;
        }

        if (days > 0 && days < 7) {
            return `${days} jour${days > 1 ? "s" : ""}`;
        }

        if (weeks > 0 && months === 0) {
            return `${weeks} semaine${weeks > 1 ? "s" : ""}`;
        }
    }

    if (months < 12) {
        return `${months} mois`;
    }

    return "plus d'un an";
}
