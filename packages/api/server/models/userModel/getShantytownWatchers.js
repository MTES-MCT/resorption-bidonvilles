const { sequelize } = require('#db/models');

module.exports = async (shantytownId, canListPrivateComments) => sequelize.query(
    `
        SELECT
            email,
            first_name,
            last_name
        FROM (
            SELECT
                u.email,
                u.first_name,
                u.last_name,
                ARRAY_AGG(up.fk_feature || '.' || up.fk_entity || '.' || up.allowed) AS permissions
            FROM shantytown_watchers sw
            LEFT JOIN users u ON sw.fk_user = u.user_id
            LEFT JOIN user_actual_permissions up ON sw.fk_user = up.user_id
            WHERE sw.fk_shantytown = :shantytownId
            GROUP BY u.email, u.first_name, u.last_name
        ) t
        ${canListPrivateComments === true ? 'WHERE t.permissions @> \'{"listPrivate.shantytown_comment.true"}\'' : ''}
    `,
    {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            shantytownId,
        },
    },
);
