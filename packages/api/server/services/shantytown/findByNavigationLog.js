const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');

module.exports = async (user) => {
    let towns;
    try {
        towns = await shantytownModel.findByNavigationLog(user);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    return towns;
};
