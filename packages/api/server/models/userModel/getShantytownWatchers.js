const { sequelize } = require('#db/models');

module.exports = async (shantytownId, includePrivate) => sequelize.query(
    `
        SELECT
            u.email,
            u.first_name,
            u.last_name
        FROM shantytown_watchers sw
        LEFT JOIN users u ON sw.fk_user = u.user_id
        LEFT JOIN user_actual_permissions up ON sw.fk_user = up.user_id
        WHERE
                sw.fk_shantytown = :shantytownId
            AND up.fk_feature = 'listPrivate'
            AND up.fk_entity = 'shantytown_comment'
            ${includePrivate === true ? 'AND up.allowed = true' : ''}
        `,
    {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            shantytownId,
        },
    },
);
