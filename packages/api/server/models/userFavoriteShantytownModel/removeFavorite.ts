import { sequelize } from '#db/sequelize';

export default function removeFavorite(userId: number, shantytownId: number) {
    return sequelize.query(
        `DELETE FROM user_favorite_shantytowns
        WHERE fk_user = :userId AND fk_shantytown = :shantytownId`,
        {
            replacements: {
                userId,
                shantytownId,
            },
        },
    );
}
