const sequelize = require('#db/sequelize');

module.exports = async (name, code) => {
    const result = await sequelize.query(
        `SELECT
            organizations.organization_id AS id,
            organizations.name,
            organizations.abbreviation,
            organization_types.fk_category
        FROM localized_organizations AS organizations
        LEFT JOIN
            organization_types ON organizations.fk_type = organization_types.organization_type_id
        WHERE
            organization_types.fk_category = 'association'
            AND
            UNACCENT(organizations.name) ILIKE UNACCENT(:name)
            AND
            organizations.departement_code = :code`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                name,
                code,
            },
        },
    );
    return result.length === 1 ? result[0] : null;
};
