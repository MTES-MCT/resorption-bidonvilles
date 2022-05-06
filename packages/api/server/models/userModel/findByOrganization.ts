import query from './_common/query';

export default (organizationId, filters = {}) => query(
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
