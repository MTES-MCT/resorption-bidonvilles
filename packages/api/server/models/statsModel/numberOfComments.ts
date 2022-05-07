import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async () => {
    const rows = await sequelize.query(
        'SELECT COUNT(*) AS total FROM shantytown_comments',
        {
            type: QueryTypes.SELECT,
        },
    );

    return rows[0].total;
};
