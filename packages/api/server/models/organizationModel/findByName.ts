import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default (name: string): Promise<{ id: number, name: string }[]> => sequelize.query(
    `SELECT
        organization_id as id,
        name
    FROM organizations
    WHERE UNACCENT(organizations.name) ILIKE UNACCENT(:name)`,
    {
        type: QueryTypes.SELECT,
        replacements: {
            name,
        },
    },
);
