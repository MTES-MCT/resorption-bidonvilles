import getSince from "#app/pages/TownsList/getSince";

export default function formatDate(date) {
    const { days } = getSince(date);

    if (days === 0) {
        return "Aujourd'hui";
    }

    if (days === 1) {
        return "Hier";
    }

    return App.formatDate(date, "d M y");
}
