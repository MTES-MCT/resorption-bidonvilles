import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async function numberOfUsersAtMonth(date: string = '2020-06-01'): Promise<number> {
    const rows: { total: number }[] = await sequelize.query(
        `SELECT
            COUNT(*) AS total
            FROM user_accesses ua
        WHERE
            ua.used_at IS NOT NULL
            AND
            ua.used_at < :date`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                date,
            },
        },
    );

    return rows[0].total;
}
