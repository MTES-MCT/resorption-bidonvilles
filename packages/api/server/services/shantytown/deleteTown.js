const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');


module.exports = async (user, shantytown_id) => {
    // check if the town exists
    const town = await shantytownModel.findOne(
        user,
        shantytown_id,
    );
    if (town === null) {
        throw new ServiceError('fetch_failed', {
            developer_message: 'Failed to retrieve the town',
            user_message: 'Impossible de retrouver le site à supprimer en base de données',
        });
    }

    // delete the town
    shantytownModel.deleteShantytown(town.id);
};
