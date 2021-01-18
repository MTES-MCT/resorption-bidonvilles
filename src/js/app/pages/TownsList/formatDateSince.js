import getSince from "./getSince";

export default function formatDateSince(date) {
    const { days, years, months } = getSince(date);
    if (years > 0) {
        return `${years} an${years > 1 ? "s" : ""}`;
    }

    if (months > 0) {
        return `${months} mois`;
    }

    if (days > 0) {
        return `${days} jours`;
    }

    return "";
}
