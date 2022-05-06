import { sequelize } from '#db/sequelize';

export default async () => {
    const rows = await sequelize.query(
        `SELECT
            count(*) as total
        FROM stats_exports`,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return rows[0].total;
};
