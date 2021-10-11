const query = require('./_common/query');

module.exports = async (regionCode, name = undefined) => {
    const where = [
        {
            nationalUser: {
                query: 'organizations.location_type',
                value: 'nation',
            },
            // or
            userInTheProperRegion: {
                query: 'organizations.region_code',
                value: regionCode,
            },
        },
        {
            fk_status: ['active'],
        },
    ];
    if (name !== undefined) {
        where.push({
            firstName: {
                query: 'users.first_name',
                operator: 'ILIKE',
                value: `${name}%`,
            },
            // or
            lastName: {
                query: 'users.last_name',
                operator: 'ILIKE',
                value: `${name}%`,
            },
        });
    }

    return query(where, {});
};
