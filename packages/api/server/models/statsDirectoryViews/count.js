const sequelize = require('#db/sequelize');

module.exports = () => sequelize.query(
    `SELECT
        count(*) as total
    FROM stats_directory_views`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
