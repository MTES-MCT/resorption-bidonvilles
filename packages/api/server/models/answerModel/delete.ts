import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (answerId: number): Promise<void> => {
    await sequelize.query(
        'DELETE FROM answers WHERE answer_id = :answerId',
        {
            type: QueryTypes.DELETE,
            replacements: {
                answerId,
            },
        },
    );
};
