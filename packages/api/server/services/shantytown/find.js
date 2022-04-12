const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');

module.exports = async (user, townId) => {
    const town = await shantytownModel.findOne(user, townId);
    if (town === null) {
        throw new ServiceError('fetch_failed', {
            developer_message: 'Failed to retrieve the town',
            user_message: 'Impossible de retrouver le site en base de données',
        });
    }
    return town;
};
