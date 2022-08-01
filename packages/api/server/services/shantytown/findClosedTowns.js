const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');

module.exports = async (user, citycode, closed_since) => {
    const town = await shantytownModel.findClosedTowns(user, citycode, closed_since);
    if (town === null) {
        throw new ServiceError('fetch_failed', new Error('Impossible de retrouver les sites en base de données'));
    }
    return town;
};
