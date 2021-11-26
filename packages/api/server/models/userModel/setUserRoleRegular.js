const { sequelize } = require('#db/models');

module.exports = async (userId, roleRegular) => {
    await sequelize.query(
        `UPDATE 
            USERS 
        SET
            fk_role_regular = :roleRegular
        WHERE
            user_id = :userId`,
        {
            replacements: {
                userId,
                roleRegular,
            },
        },
    );
};
