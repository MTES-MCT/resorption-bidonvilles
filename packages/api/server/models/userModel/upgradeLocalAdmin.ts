import { sequelize } from '#db/sequelize';

export default async (userId) => {
    await sequelize.query(
        'UPDATE USERS SET fk_role = \'local_admin\' where user_id = :userId',
        {
            replacements: {
                userId,
            },
        },
    );
};
