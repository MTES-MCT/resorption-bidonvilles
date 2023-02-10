import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async () => sequelize.query(
    `
        SELECT COUNT(*) AS total, fk_departement
        FROM actions
        WHERE ended_at IS NULL
        GROUP BY fk_departement
        ORDER BY fk_departement
        `,
    {
        type: QueryTypes.SELECT,
    },
);
