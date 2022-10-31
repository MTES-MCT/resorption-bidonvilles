import shantytownModelFactory from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';

const shantytownModel = shantytownModelFactory();

export default async (user, search = undefined) => {
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
        shantytowns = await shantytownModel.findAll(
            user,
            filters,
            'list',
        );
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    return shantytowns;
};
