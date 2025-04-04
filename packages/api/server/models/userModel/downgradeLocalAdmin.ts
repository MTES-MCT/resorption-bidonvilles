import { sequelize } from '#db/sequelize';

export default async (userId) => {
    await sequelize.query(
        'UPDATE USERS SET fk_role = NULL, updated_at = NOW() where user_id = :userId',
        {
            replacements: {
                userId,
            },
        },
    );
};
