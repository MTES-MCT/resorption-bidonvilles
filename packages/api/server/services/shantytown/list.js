const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');


module.exports = async (user) => {
    let shantytowns;
    try {
        shantytowns = await shantytownModel.findAll(user, [], 'list');
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    return shantytowns;
};
