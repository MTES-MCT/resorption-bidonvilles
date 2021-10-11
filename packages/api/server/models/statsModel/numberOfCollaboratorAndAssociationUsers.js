const { sequelize } = require('#db/models');

module.exports = async () => {
    const rows = await sequelize.query(
        `SELECT
            organization_types.fk_category,
            COUNT(*) AS total
        FROM users
        LEFT JOIN localized_organizations AS organizations ON users.fk_organization = organizations.organization_id
        LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
        WHERE
            users.fk_status='active'
            AND
            organizations.active = TRUE
            AND
            organization_types.fk_category IN ('territorial_collectivity', 'association', 'public_establishment', 'administration')
        GROUP BY organization_types.fk_category    
        `,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return rows.reduce((hash, row) => Object.assign({}, hash, {
        [row.fk_category]: row.total,
    }), {});
};
