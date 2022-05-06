import query from './_common/query';

export default async (user, shantytownId) => {
    const towns = await query(
        [{ shantytown_id: shantytownId }],
        undefined,
        user,
        'read',
        true, // include changelog
    );
    return towns.length === 1 ? towns[0] : null;
};
