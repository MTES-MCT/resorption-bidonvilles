import query from './query';

export default () => query([
    {
        fk_role: {
            value: ['national_admin'],
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
