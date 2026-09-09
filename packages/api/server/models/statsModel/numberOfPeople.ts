import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async function numberOfPeople(departement?: string): Promise<number | null> {
    const rows: { total: number | null }[] = await sequelize.query(
        `
        SELECT SUM(population_total) AS total
        FROM shantytowns 
        LEFT JOIN cities AS city ON shantytowns.fk_city = city.code
        WHERE closed_at IS NULL
        ${departement ? 'AND fk_departement = :departement' : ''}
        `,
        {
            type: QueryTypes.SELECT,
            replacements: {
                departement,
            },
        },
    );

    return rows[0].total;
}
