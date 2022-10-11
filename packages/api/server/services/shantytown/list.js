const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');


module.exports = async (user, search = undefined) => {
    const filters = search !== undefined ? [
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
    ] : [];
    let shantytowns;
    try {
        console.time('====================analyse shantytownModel.findAll====================');
        shantytowns = await shantytownModel.findAll(
            user,
            filters,
            'list',
        );
        console.timeEnd('====================analyse shantytownModel.findAll====================');
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    return shantytowns;
};
