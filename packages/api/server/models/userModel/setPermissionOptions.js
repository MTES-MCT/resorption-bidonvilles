const { sequelize } = require('#db/models');

module.exports = async (userId, options) => sequelize.transaction(
    t => sequelize.query('DELETE FROM user_permission_options WHERE fk_user = :userId', {
        transaction: t,
        replacements: {
            userId,
        },
    })
        .then(() => Promise.all(
            options.map(option => sequelize.query(
                'INSERT INTO user_permission_options(fk_user, fk_option) VALUES (:userId, :option)',
                {
                    transaction: t,
                    replacements: {
                        userId,
                        option,
                    },
                },
            )),
        )),
);
