import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (date = '2020-06-01') => {
    const rows = await sequelize.query(
        `SELECT
            COUNT(*) AS total
            FROM user_accesses ua
        WHERE 
            ua.used_at IS NOT NULL
            AND
            ua.used_at < '${date}'`,
        {
            type: QueryTypes.SELECT,
        },
    );

    return rows[0].total;
};
