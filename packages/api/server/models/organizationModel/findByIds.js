const sequelize = require('#db/sequelize');

module.exports = ids => sequelize.query(
    `SELECT
        organizations.organization_id AS id,
        organizations.name,
        organizations.fk_type,
        organizations.being_funded,
        organizations.being_funded_at,
        organization_types.fk_category
    FROM organizations
    LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
    WHERE organizations.organization_id IN (:ids)`,
    {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            ids,
        },
    },
);
