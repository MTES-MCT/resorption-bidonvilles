import { sequelize } from '#db/sequelize';

export default async () => sequelize.query(
    `
        SELECT SUM(population_total) AS total, fk_departement 
        FROM shantytowns 
        LEFT JOIN cities AS city ON shantytowns.fk_city = city.code
        WHERE closed_at IS NULL
        GROUP BY fk_departement
        ORDER BY fk_departement
        `,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
