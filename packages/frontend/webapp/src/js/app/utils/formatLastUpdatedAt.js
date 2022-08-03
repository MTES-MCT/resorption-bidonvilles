import formatDateSinceActivity from "#app/utils/formatDateSinceActivity";
import getSince from "./getSince";

export default town => {
    const { months } = getSince(Math.abs(town.updatedAt));

    if (months >= 3) {
        return `Pas de mise à jour depuis ${formatDateSinceActivity(
            town.updatedAt
        )}`;
    } else if (Math.abs(town.updatedAt - town.createdAt) < 1) {
        return `Ajouté il y a ${formatDateSinceActivity(town.createdAt)}`;
    }

    return `Mis à jour il y a ${formatDateSinceActivity(town.updatedAt)}`;
};
