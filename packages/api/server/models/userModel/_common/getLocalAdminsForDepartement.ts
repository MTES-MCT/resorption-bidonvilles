import { User } from '#root/types/resources/User.d';
import query from './query';

export default async (departements: string[]): Promise<User[]> => {
    const baseQuery = [
        {
            fk_role: {
                value: ['local_admin'],
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
    ];

    const promises = [
        // get local admins for departements
        query([
            ...baseQuery,
            {
                departement: {
                    value: departements,
                    query: 'v_user_areas.departements::text[]',
                    arrayOperator: true,
                    operator: '&&',
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

    departements.forEach((code) => {
        if (exceptions[code] === undefined) {
            return;
        }

        promises.push(query([
            ...baseQuery,
            {
                region: {
                    value: [exceptions[code]],
                    query: 'v_user_areas.regions',
                    arrayOperator: true,
                    operator: '&&',
                },
            },
        ], {}));
    });

    const users = await Promise.all(promises);
    return users.flat();
};
