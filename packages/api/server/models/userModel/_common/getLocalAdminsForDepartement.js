const query = require('./query');

module.exports = departementCode => query([
    {
        fk_role: ['local_admin'],
    },
    {
        departement: {
            query: 'organizations.departement_code',
            value: [departementCode],
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
