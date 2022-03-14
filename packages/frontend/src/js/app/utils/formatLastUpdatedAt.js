import formatDateSinceActivity from "#app/utils/formatDateSinceActivity";

export default town => {
    if (Math.abs(town.updatedAt - town.createdAt) < 1) {
        return `Saisi ${formatDateSinceActivity(town.createdAt)}`;
    }

    return `Mis à jour ${formatDateSinceActivity(town.updatedAt)}`;
};
