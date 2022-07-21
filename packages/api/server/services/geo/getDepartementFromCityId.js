const geoModel = require('#server/models/geoModel');
const ServiceError = require('#server/errors/ServiceError');

module.exports = async (cityId) => {
    const departement = await geoModel.getDepartementFromCityId(cityId);
    if (departement === null) {
        throw new ServiceError('fetch_failed', new Error('Impossible de retrouver le département en base de données'));
    }
    return departement;
};
