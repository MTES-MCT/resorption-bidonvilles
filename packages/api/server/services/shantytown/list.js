const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');


module.exports = async (user, search = undefined) => {
    let shantytowns;
    try {
        shantytowns = await shantytownModel.findAll(
            user,
            [
                {
                    name: {
                        operator: 'ILIKE',
                        value: `%${search}%`,
                    },
                    address: {
                        operator: 'ILIKE',
                        value: `%${search}%`,
                    },
                },
            ],
            'list',
        );
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    return shantytowns;
};
