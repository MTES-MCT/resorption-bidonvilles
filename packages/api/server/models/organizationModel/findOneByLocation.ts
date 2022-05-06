import { sequelize } from '#db/sequelize';

export default async (typeName, typeLevel, code) => {
    const result = await sequelize.query(
        `SELECT
            organizations.organization_id AS id,
            organizations.name,
            organization_types.fk_category
        FROM localized_organizations AS organizations
        LEFT JOIN
            organization_types ON organizations.fk_type = organization_types.organization_type_id
        WHERE
            organization_types.name_singular = :typeName
            AND
            organizations.${typeLevel}_code = :code`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                typeName,
                code,
            },
        },
    );
    return result.length === 1 ? result[0] : null;
};
