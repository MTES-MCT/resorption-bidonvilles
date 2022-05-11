const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');


module.exports = async (user) => {
    let shantytowns;
    try {
        shantytowns = await shantytownModel.findAll(user, [], 'list');
    } catch (error) {
        throw new ServiceError('fetch_failed', new Error('Une erreur est survenue pendant la récupération des sites en base de données'));
    }

    return shantytowns;
};
