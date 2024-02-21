import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

import serializeRole from './_common/serializeRole';
import { Role } from '#root/types/resources/Role.d';

type RoleRow = {
    id: string;
    name: string;
};

export default async (type: 'regular' | 'admin' = undefined): Promise<Role[]> => {
    const roles: RoleRow[] = await sequelize.query(
        `SELECT
            roles.role_id AS id,
            roles.name AS name
        FROM roles
        ${type !== undefined ? 'WHERE roles.type = :type' : ''}`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                type,
            },
        },
    );

    return roles.map(serializeRole);
};
