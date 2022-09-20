const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');

module.exports = async (user) => {
    let towns;
    try {
        towns = await shantytownModel.findByNavigationLog(user);
    } catch (error) {
        throw new ServiceError('fetch_failed', new Error('Impossible de trouver les sites en base de données'));
    }

    return towns;
};
