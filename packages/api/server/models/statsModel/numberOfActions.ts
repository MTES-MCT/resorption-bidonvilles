import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (departement) => {
    const rows: any = await sequelize.query(
        `
        SELECT COUNT(*) AS total 
        FROM actions
        WHERE ended_at IS NULL
        ${departement ? `AND fk_departement = '${departement}'` : ''}
        `,
        {
            type: QueryTypes.SELECT,
        },
    );

    return rows[0].total;
};
