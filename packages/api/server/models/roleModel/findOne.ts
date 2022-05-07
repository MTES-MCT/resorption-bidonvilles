import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

type Replacements = {
    role_id: string,
    type?: string
};

export default async (id, type = null) => {
    const replacements: Replacements = {
        role_id: id,
    };

    if (type !== null) {
        replacements.type = type;
    }

    const role = await sequelize.query(
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
