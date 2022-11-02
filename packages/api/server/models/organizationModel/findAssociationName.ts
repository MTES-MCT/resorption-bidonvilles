import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (name) => {
    const result = await sequelize.query(
        `SELECT
            organizations.name,
            organizations.abbreviation
        FROM localized_organizations AS organizations
        LEFT JOIN
            organization_types ON organizations.fk_type = organization_types.organization_type_id
        WHERE
            organization_types.fk_category = 'association'
            AND
            UNACCENT(organizations.name) ILIKE UNACCENT(:name)`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                name,
            },
        },
    );
    return result.length > 0 ? result[0] : null;
};
