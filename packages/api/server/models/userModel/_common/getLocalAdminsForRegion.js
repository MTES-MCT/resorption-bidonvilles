const query = require('./query');

module.exports = regionCode => query([
    {
        fk_role: ['local_admin'],
    },
    {
        region: {
            query: 'organizations.region_code',
            value: [regionCode],
        },
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
], {});
