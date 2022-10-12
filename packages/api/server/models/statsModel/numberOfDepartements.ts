const sequelize = require('#db/sequelize');

module.exports = async () => {
    const rows = await sequelize.query(
        `SELECT
                COUNT(*) AS total
            FROM (
                SELECT
                    organizations.departement_code
                FROM users
                LEFT JOIN localized_organizations AS organizations ON users.fk_organization = organizations.organization_id
                WHERE
                    users.fk_status='active'
                    AND
                    organizations.active = TRUE
                GROUP BY organizations.departement_code
            ) t`,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return rows[0].total;
};
