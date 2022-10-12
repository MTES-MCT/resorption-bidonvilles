const query = require('./query');

module.exports = () => query([
    {
        fk_role: ['national_admin'],
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
