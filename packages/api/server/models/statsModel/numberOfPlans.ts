import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (departement) => {
    const rows = await sequelize.query(
        `
        SELECT COUNT(*) AS total 
        FROM plans2
        LEFT JOIN plan_departements on plan_departements.fk_plan = plans2.plan_id
        WHERE closed_at IS NULL
        ${departement ? `AND fk_departement = '${departement}'` : ''}
        `,
        {
            type: QueryTypes.SELECT,
        },
    );

    return rows[0].total;
};
