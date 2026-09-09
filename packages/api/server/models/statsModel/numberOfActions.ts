import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async function numberOfActions(departement?: string): Promise<number> {
    const rows: { total: number }[] = await sequelize.query(
        `
        SELECT COUNT(*) AS total 
        FROM actions
        WHERE ended_at IS NULL
        ${departement ? 'AND fk_departement = :departement' : ''}
        `,
        {
            type: QueryTypes.SELECT,
            replacements: { departement },
        },
    );

    return rows[0].total;
}
