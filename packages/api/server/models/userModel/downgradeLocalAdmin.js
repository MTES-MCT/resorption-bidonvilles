const { sequelize } = require('#db/models');

module.exports = async (userId) => {
    await sequelize.query(
        'UPDATE USERS SET fk_role = NULL where user_id = :userId',
        {
            replacements: {
                userId,
            },
        },
    );
};
