const sequelize = require('#db/sequelize');

module.exports = () => sequelize.query(
    `SELECT
        COUNT(DISTINCT fk_user) AS wau,
        t.monday
    FROM (
        SELECT fk_user, DATE_TRUNC('week', datetime) AS monday
        FROM user_navigation_logs
    ) t
    GROUP BY t.monday ORDER BY monday ASC`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
