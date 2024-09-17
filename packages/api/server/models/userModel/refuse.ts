import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

export default async (id: number, transaction: Transaction = undefined): Promise<void> => {
    await sequelize.query(
        `UPDATE
                users
            SET
                fk_status = 'refused',
                updated_at = NOW()
            WHERE
                user_id = (:id)
            `,
        {
            replacements: {
                id,
            },
            transaction,
        },
    );
};
