import query from './query';

export default departementCode => query([
    {
        fk_role: {
            value: ['local_admin'],
        },
    },
    {
        departement: {
            query: 'organizations.departement_code',
            value: [departementCode],
        },
    },
    {
        fk_status: {
            value: ['active'],
        },
    },
    {
        organization_active: {
            query: 'organizations.active',
            value: [true],
        },
    },
], {});
