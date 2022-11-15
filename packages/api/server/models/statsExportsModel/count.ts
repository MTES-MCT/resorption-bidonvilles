import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async () => {
    const rows: any = await sequelize.query(
        `SELECT
            count(*) as total
        FROM stats_exports`,
        {
            type: QueryTypes.SELECT,
        },
    );

    return rows[0].total;
};
