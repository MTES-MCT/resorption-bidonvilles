const sequelize = require('#db/sequelize');

module.exports = async (userId) => {
    await sequelize.query(
        'UPDATE USERS SET fk_role = \'local_admin\' where user_id = :userId',
        {
            replacements: {
                userId,
            },
        },
    );
};
