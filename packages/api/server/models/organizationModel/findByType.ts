import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

type OrganizationMin = {
    id: number,
    name: string,
    abbreviation: string | null,
    organization_type_name: string,
};

export default (typeId: number): Promise<OrganizationMin[]> => sequelize.query(
    `SELECT
        organizations.organization_id AS id,
        organizations.name,
        organizations.abbreviation,
        organization_types.name_singular AS organization_type_name
    FROM organizations
    LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
    WHERE
        organizations.fk_type = :typeId
    ORDER BY
        CASE organization_types.uid
            WHEN 'rectorat' THEN SUBSTRING(organizations.name, '(?<=(?:d''|de la |de ))[A-Z].+')
            ELSE '' END
        ASC,
        UNACCENT(organizations.name) ASC`,
    {
        type: QueryTypes.SELECT,
        replacements: {
            typeId,
        },
    },
);
