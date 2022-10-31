import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (userId) => {
    const rows = await sequelize.query(
        `
        SELECT user_accesses.user_access_id,
                user_accesses.expires_at
            FROM user_accesses
        LEFT JOIN users ON user_accesses.fk_user = users.user_id
            WHERE
                    user_accesses.expires_at > NOW()
                AND user_accesses.used_at IS NULL
                AND user_accesses.fk_user = :userId
                AND users.fk_status = 'new'
        ORDER BY user_accesses.created_at DESC
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
