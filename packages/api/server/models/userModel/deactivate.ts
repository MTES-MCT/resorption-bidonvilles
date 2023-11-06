import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

export default async (ids: number[], transaction: Transaction = undefined): Promise<void> => {
    await sequelize.query(
        `UPDATE
            users
        SET
            fk_status = 'inactive',
            updated_at = NOW()
        WHERE
            user_id IN (:ids)
        `,
        {
            replacements: {
                ids,
            },
            transaction,
        },
    );
};
