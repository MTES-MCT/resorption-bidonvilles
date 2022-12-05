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
    const { months } = getSince(Math.abs(town.updatedAt));

    if (months >= 3) {
        return `Pas de mise à jour depuis ${formatDateSinceActivity(
            town.updatedAt
        )}`;
    } else if (Math.abs(town.updatedAt - town.createdAt) < 1) {
        return `Ajouté ${compute(town.createdAt)}`;
    }

    return `Mis à jour ${compute(town.updatedAt)}`;
};
