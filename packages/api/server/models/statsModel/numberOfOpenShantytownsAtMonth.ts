import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (departement, date = '2020-06-01') => {
    const rows: any = await sequelize.query(
        `SELECT
            COUNT(*) AS total
        FROM shantytowns LEFT JOIN cities AS city ON shantytowns.fk_city = city.code
        WHERE 
            (shantytowns.created_at <= '${date}')
            AND 
            (shantytowns.closed_at >= '${date}' OR shantytowns.closed_at IS NULL)
            ${departement ? `AND fk_departement = '${departement}'` : ''}
            `,
        {
            type: QueryTypes.SELECT,
        },
    );

    return rows[0].total;
};
