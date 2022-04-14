const sequelize = require('#db/sequelize');

module.exports = () => sequelize.query(
    `SELECT
        count(*) as total
    FROM stats_exports`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
