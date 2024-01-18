import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async () => {
    const rows: any = await sequelize.query(
        `SELECT
            COUNT(*) AS total
        FROM users
        WHERE
            users.last_access IS NOT NULL
            AND
            to_be_tracked = TRUE
        `,
        {
            type: QueryTypes.SELECT,
        },
    );

    return rows[0].total;
};
