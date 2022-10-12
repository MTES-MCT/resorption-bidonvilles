const query = require('./_common/query');

module.exports = (organizationId, filters = {}) => query(
    [
        {
            organization: {
                query: 'organizations.organization_id',
                value: [organizationId],
            },
        },
    ],
    filters,
);
