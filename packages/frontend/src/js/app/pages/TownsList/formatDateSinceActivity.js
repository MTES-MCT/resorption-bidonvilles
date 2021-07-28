import getSince from "./getSince";

export default function formatDateSinceActivity(ts) {
    const { days, months, weeks } = getSince(ts);

    if (months === 0) {
        if (days === 0) {
            return `aujourd'hui`;
        }

        if (days > 0 && days < 7) {
            return `il y a ${days} jour${days > 1 ? "s" : ""}`;
        }

        if (weeks > 0 && months === 0) {
            return `il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
        }
    }

    if (months < 12) {
        return `il y a ${months} mois`;
    }

    return "il y a plus d'un an";
}
