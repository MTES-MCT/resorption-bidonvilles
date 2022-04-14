const sequelize = require('#db/sequelize');

module.exports = () => sequelize.query(
    `SELECT
        regions.code AS code,
        regions.name AS name
    FROM regions`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
