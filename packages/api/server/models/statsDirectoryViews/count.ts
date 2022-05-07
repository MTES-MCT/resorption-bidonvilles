import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async () => {
    const rows = await sequelize.query(
        `SELECT
            count(*) as total
        FROM stats_directory_views`,
        {
            type: QueryTypes.SELECT,
        },
    );

    return rows[0].total;
};
