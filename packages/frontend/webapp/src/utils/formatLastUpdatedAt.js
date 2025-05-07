import formatDateSinceActivity from "./formatDateSinceActivity";
import getSince from "./getSince";

function compute(date) {
    const since = formatDateSinceActivity(date);
    if (since === "aujourd'hui") {
        return since;
    }

    return `il y a ${since}`;
}

export default (town) => {
    const { months } = getSince(Math.abs(town.lastUpdatedAt));

    const { months: monthsUpdate } = getSince(Math.abs(town.updatedAt));

    if (monthsUpdate >= 1 && monthsUpdate < 6 && months >= 1 && months < 6) {
        return `Dernière activité il y a ${formatDateSinceActivity(
            Math.max(town.lastUpdatedAt, town.updatedAt) || town.updatedAt
        )}`;
    } else if (monthsUpdate >= 6) {
        return `Pas de mise à jour depuis ${formatDateSinceActivity(
            town.updatedAt
        )}`;
    } else if (Math.abs(town.updatedAt - town.createdAt) < 1) {
        return `Ajouté ${compute(town.createdAt)}`;
    }

    return `Dernière activité ${compute(
        Math.max(town.lastUpdatedAt, town.updatedAt) || town.updatedAt
    )}`;
};
