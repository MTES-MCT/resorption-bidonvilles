import getSince from "#app/pages/TownsList/getSince";

export default function formatDate(date) {
    const { days } = getSince(date);

    let day = `${App.formatDate(date, "U")} ${App.formatDate(date, "d M y")}`;
    if (days === 0) {
        day = "Aujourd'hui";
    } else if (days === 1) {
        day = "Hier";
    }

    return `${day} à ${App.formatDate(date, "h")}h`;
}
