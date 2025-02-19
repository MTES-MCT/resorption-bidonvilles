import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

export default async (id: number, transaction?: Transaction): Promise<void> => {
    const response = await sequelize.query(
        'DELETE FROM questions WHERE question_id = :id',
        {
            transaction,
            replacements: {
                id,
            },
        },
    );

    const rowCount: number = response[0] as unknown as number;
    if (rowCount === 0) {
        throw new Error(`Question ${id} introuvable`);
    }
};
