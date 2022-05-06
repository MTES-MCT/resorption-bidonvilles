import { sequelize } from '#db/sequelize';

export default async () => sequelize.query(
    `
        SELECT COUNT(*) AS total, fk_departement
        FROM plans2
        LEFT JOIN plan_departements on plan_departements.fk_plan = plans2.plan_id
        WHERE closed_at IS NULL
        GROUP BY fk_departement
        ORDER BY fk_departement
        `,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
