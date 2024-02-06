import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

type RoleRaw = {
    id: string,
    name: string,
};

export default async (id: string, type: 'regular' | 'admin' = null): Promise<RoleRaw | null> => {
    const replacements: { role_id: string, type?: 'regular' | 'admin' } = {
        role_id: id,
    };

    if (type !== null) {
        replacements.type = type;
    }

    const role: RoleRaw[] = await sequelize.query(
        `SELECT
            roles.role_id AS id,
            roles.name AS name
        FROM roles
        WHERE ${Object.keys(replacements).map(col => `${col} = :${col}`).join(' AND ')}`,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );

    return role.length > 0 ? role[0] : null;
};
