import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (userId: number, shantytownId: number): Promise<boolean> => {
    const rows: { is_favorite: boolean }[] = await sequelize.query(
        `SELECT EXISTS(
            SELECT 1 FROM user_favorite_shantytowns
            WHERE fk_user = :userId AND fk_shantytown = :shantytownId
        ) AS is_favorite`,
        {
            replacements: { userId, shantytownId },
            type: QueryTypes.SELECT,
        },
    );
    return rows[0].is_favorite;
};
