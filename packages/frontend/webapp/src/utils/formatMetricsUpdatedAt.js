import formatDateSinceActivity from "./formatDateSinceActivity";

function compute(date) {
    const since = formatDateSinceActivity(date / 1000);
    if (since === "aujourd'hui") {
        return since;
    }

    return `il y a ${since}`;
}

export default (action) => {
    if (!action.metrics_updated_at) {
        return "Aucun indicateur renseigné";
    }

    return `Indicateurs mis à jour ${compute(action.metrics_updated_at)}`;
};
