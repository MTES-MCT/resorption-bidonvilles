const { sequelize } = require('#db/models');

module.exports = async () => sequelize.query(
    `
        SELECT COUNT(*) AS total, fk_departement
        FROM shantytowns 
        LEFT JOIN cities AS city ON shantytowns.fk_city = city.code
        WHERE closed_at IS NULL
        GROUP BY fk_departement
        ORDER BY fk_departement
        `,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
