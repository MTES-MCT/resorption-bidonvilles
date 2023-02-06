import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (name) => {
    const result = await sequelize.query(
        `SELECT
            organization_id as id
        FROM organizations
        WHERE UNACCENT(organizations.name) ILIKE UNACCENT(:name)`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                name,
            },
        },
    );
    return result;
};
