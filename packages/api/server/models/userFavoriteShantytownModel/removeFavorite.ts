import { sequelize } from '#db/sequelize';

export default (userId: number, shantytownId: number) => sequelize.query(
    `DELETE FROM user_favorite_shantytowns
     WHERE fk_user = :userId AND fk_shantytown = :shantytownId`,
    {
        replacements: {
            userId,
            shantytownId,
        },
    },
);
