import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

import convertToDateMapping, { Result } from './_common/convertToDateMapping';

export default async function numberOfResorbedShantytownsPerMonth(
    departement?: string,
    startDateStr: string = '2019-06-01',
): Promise<Result[]> {
    const rows: {
        year: string;
        month: string;
        total: string;
    }[] = await sequelize.query(
        `SELECT 
            EXTRACT(YEAR FROM shantytowns.closed_at) AS year,
            EXTRACT(MONTH FROM shantytowns.closed_at) AS month,
            COUNT(*) AS total
        FROM shantytowns LEFT JOIN cities AS city ON shantytowns.fk_city = city.code
        WHERE
            closed_at > :startDateStr
            AND
            closed_with_solutions = 'yes'
            ${departement ? 'AND fk_departement = :departement' : ''}
        GROUP BY year, month
        ORDER BY year ASC ,month ASC`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                departement,
                startDateStr,
            },
        },
    );

    return convertToDateMapping(rows, new Date(startDateStr));
}
