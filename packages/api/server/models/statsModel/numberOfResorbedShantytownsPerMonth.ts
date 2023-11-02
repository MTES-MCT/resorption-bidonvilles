import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

import convertToDateMapping from './_common/convertToDateMapping';

export default async (departement = null, startDateStr = '2019-06-01') => {
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
            closed_at > '${startDateStr}'
            AND
            closed_with_solutions = 'yes'
            ${departement ? `AND fk_departement = '${departement}'` : ''}
        GROUP BY year, month
        ORDER BY year ASC ,month ASC`,
        {
            type: QueryTypes.SELECT,
        },
    );

    return convertToDateMapping(rows, new Date(startDateStr));
};
