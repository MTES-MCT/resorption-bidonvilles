const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');


module.exports = async (user, shantytown_id) => {
    // check if the town exists
    let town;
    try {
        town = await shantytownModel.findOne(
            user,
            shantytown_id,
        );
    } catch (error) {
        throw new ServiceError('fetch_failed', new Error(`Impossible de retrouver le site #${shantytown_id} à supprimer en base de données`));
    }

    if (town === null) {
        throw new ServiceError('shantytown_unfound', new Error(`le site #${shantytown_id} n'existe pas en base de données`));
    }

    // delete the town
    try {
        await shantytownModel.deleteShantytown(town.id);
    } catch (error) {
        throw new ServiceError('delete_failed', new Error(`Impossible de supprimer le site #${shantytown_id} en base de données`));
    }
};
