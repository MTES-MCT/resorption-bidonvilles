const { sequelize } = require('#db/models');

module.exports = () => sequelize.query(
    `SELECT
        departements.code AS code,
        departements.name AS name,
        departements.fk_region AS region
    FROM departements
    ORDER BY code ASC`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
