import formatDateSinceActivity from "./formatDateSinceActivity";

function compute(date) {
    const since = formatDateSinceActivity(date / 1000);
    if (since === "aujourd'hui") {
        return "Mis à jour aujourd'hui";
    }

    return `Mis à jour il y a ${since}`;
}

const formatMetricsUpdatedAt = (action) => {
    if (!action.metrics_updated_at) {
        return "Aucun indicateur renseigné";
    }

    return compute(action.metrics_updated_at);
};
export default formatMetricsUpdatedAt;
