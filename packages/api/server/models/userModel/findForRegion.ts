import { Where } from '#server/models/_common/types/Where.d';
import query from './_common/query';

export default async (regionCode, name = undefined) => {
    const where: Where = [
        {
            nationalUser: {
                query: 'v_user_areas.is_national',
                value: true,
            },
            // or
            userInTheProperRegion: {
                value: [regionCode],
                query: 'v_user_areas.regions::text[]',
                arrayOperator: true,
                operator: '&&',
            },
        },
        {
            fk_status: {
                value: ['active'],
            },
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
