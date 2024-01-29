import query from './_common/query';

export default async (user, shantytownId, feature = 'read') => {
    const towns = await query(
        user,
        feature,
        [{ shantytown_id: shantytownId }],
        undefined,
        true, // include changelog
    );
    return towns.length === 1 ? towns[0] : null;
};
