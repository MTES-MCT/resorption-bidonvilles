import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default (name: string): Promise<{ id: number }[]> => sequelize.query(
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
