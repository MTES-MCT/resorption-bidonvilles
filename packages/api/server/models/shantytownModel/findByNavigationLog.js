const sequelize = require('#db/sequelize');
const findAll = require('./findAll');


module.exports = async (user) => {
    const [ids] = await sequelize.query(
        `SELECT
            SUBSTR(page,7) AS shantytown_id
        FROM user_navigation_logs
        WHERE 
            page ilike '/site/%'
            AND page NOT ilike '/site/%/%'
            AND fk_user = :userId
            AND datetime > current_date - interval '1 day'
        GROUP BY shantytown_id`,
        {
            replacements: {
                userId: user.id,
            },
        },
    );
    return findAll(user, [{ shantytown_id: ids.map(({ shantytown_id: id }) => id) }]);
};
