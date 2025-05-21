import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

export default async (ids: number[], transaction: Transaction = undefined): Promise<void> => {
    await sequelize.query(
        `UPDATE
            users
        SET
            anonymization_requested = CASE
                WHEN anonymization_requested IS NULL THEN true
                ELSE NOT anonymization_requested
            END
        WHERE
            user_id IN (:ids)
        `,
        {
            replacements: { ids },
            transaction,
        },
    );
};
