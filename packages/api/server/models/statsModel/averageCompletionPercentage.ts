import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

import averageCompletionQuery from './_common/averageCompletion';

export default async (departement) => {
    const rows: any = await sequelize.query(
        `SELECT
            AVG(pourcentage_completion)
        FROM
        ${averageCompletionQuery(departement)}
        `,
        {
            type: QueryTypes.SELECT,
        },
    );

    return rows[0].avg;
};
