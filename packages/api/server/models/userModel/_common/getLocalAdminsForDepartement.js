const query = require('./query');

module.exports = async (departementCode) => {
    const baseQuery = [
        {
            fk_role: ['local_admin'],
        },
        {
            fk_status: ['active'],
        },
        {
            organization_active: {
                query: 'organizations.active',
                value: [true],
            },
        },
    ];

    const promises = [
        // get local admins for departements
        query([
            ...baseQuery,
            {
                departement: {
                    query: 'organizations.departement_code',
                    value: [departementCode],
                },
            },
        ], {}),
    ];

    // get local admins for regions (guyane et mayotte only)
    /* eslint-disable quote-props */
    const exceptions = {
        // guyane
        '973': '03',
        // mayotte
        '976': '06',
    };
    /* eslint-enable quote-props */

    if (exceptions[departementCode] !== undefined) {
        promises.push(query([
            ...baseQuery,
            {
                level: {
                    query: 'organizations.location_type',
                    value: 'region',
                },
            },
            {
                region: {
                    query: 'organizations.region_code',
                    value: exceptions[departementCode],
                },
            },
        ], {}));
    }

    const users = await Promise.all(promises);
    return users.flat();
};
