import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (userId) => {
    const rows = await sequelize.query(
        `
        SELECT user_accesses.user_access_id
            FROM user_accesses
            WHERE fk_user = :userId
            LIMIT 1`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                userId,
            },
        },
    );

    if (rows.length !== 1) {
        return null;
    }

    return rows[0];
};
