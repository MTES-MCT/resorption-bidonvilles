import { sequelize } from '#db/sequelize';
import averageCompletionQuery from './_common/averageCompletion';

export default async (departement) => {
    const rows = await sequelize.query(
        `SELECT
            AVG(pourcentage_completion)
        FROM
        ${averageCompletionQuery(departement)}
        `,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return rows[0].avg;
};
