import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import averageCompletionQuery from './_common/averageCompletion';

export default async () => sequelize.query(
    `SELECT
            fk_departement, AVG(pourcentage_completion)
            FROM
            ${averageCompletionQuery()}
            GROUP BY fk_departement
            ORDER BY fk_departement`,
    {
        type: QueryTypes.SELECT,
    },
);
