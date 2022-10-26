const sequelize = require('#db/sequelize');

module.exports = () => sequelize.query(
    `SELECT
        COUNT(DISTINCT fk_user) AS wau,
        to_char(t.monday, 'DD/MM/YYYY') AS monday
    FROM (
        SELECT user_webapp_navigation_logs.fk_user, DATE_TRUNC('week', user_webapp_navigation_logs.datetime) AS monday
        FROM user_webapp_navigation_logs
        LEFT JOIN users ON user_webapp_navigation_logs.fk_user = users.user_id
        WHERE user_webapp_navigation_logs.datetime < DATE_TRUNC('week', NOW()) 
    ) t
    GROUP BY t.monday ORDER BY t.monday ASC`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
