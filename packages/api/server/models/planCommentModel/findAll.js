const sequelize = require('#db/sequelize');

module.exports = () => sequelize.query(
    `
        SELECT
            pc.plan_comment_id AS "commentId",
            pc.description AS "commentDescription",
            pc.fk_plan AS "planId",
            pc.created_at AS "commentCreatedAt",
            pc.created_by "commentCreatedBy",
            u.user_id AS "userId",
            u.first_name AS "userFirstName",
            u.last_name AS "userLastName",
        FROM
            plan_comments pc
        LEFT JOIN
            users u ON pc.created_by = u.user_id
        ORDER BY pc.created_at DESC`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
