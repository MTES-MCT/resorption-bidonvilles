import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async function findByUser(userId: number): Promise<number[]> {
    const rows: { fk_shantytown: number }[] = await sequelize.query(
        `SELECT fk_shantytown
         FROM user_favorite_shantytowns
         WHERE fk_user = :userId`,
        {
            replacements: { userId },
            type: QueryTypes.SELECT,
        },
    );

    return rows.map(({ fk_shantytown }) => fk_shantytown);
}
