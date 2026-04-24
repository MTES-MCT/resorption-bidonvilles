import { sequelize } from '#db/sequelize';

export default function addFavorite(userId: number, shantytownId: number) {
    return sequelize.query(
        `INSERT INTO user_favorite_shantytowns (fk_user, fk_shantytown)
        VALUES (:userId, :shantytownId)
        ON CONFLICT (fk_user, fk_shantytown) DO NOTHING`,
        {
            replacements: {
                userId,
                shantytownId,
            },
        },
    );
}
