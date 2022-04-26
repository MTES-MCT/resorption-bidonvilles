const sequelize = require('#db/sequelize');

module.exports = () => sequelize.query(
    `SELECT
        COUNT(DISTINCT fk_user) AS wau,
        to_char(t.monday, 'DD/MM/YYYY') AS monday
    FROM (
        SELECT user_navigation_logs.fk_user, DATE_TRUNC('week', user_navigation_logs.datetime) AS monday
        FROM user_navigation_logs
        LEFT JOIN users ON user_navigation_logs.fk_user = users.user_id
        WHERE user_navigation_logs.datetime < DATE_TRUNC('week', NOW()) AND (users.fk_role <> 'national_admin' OR users.fk_role IS NULL)
    ) t
    GROUP BY t.monday ORDER BY monday ASC`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
