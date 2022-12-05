import { Where } from '#server/models/_common/types/Where';
import query from './_common/query';

export default async (regionCode, name = undefined) => {
    const where: Where = [
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
