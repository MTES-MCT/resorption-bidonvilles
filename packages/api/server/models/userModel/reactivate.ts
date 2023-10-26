import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

export default async (id: number, transaction: Transaction = undefined): Promise<void> => {
    await sequelize.query(
        `UPDATE
            users
        SET
            fk_status = CASE
                WHEN users.password IS NULL THEN 'new'
                ELSE 'active'
            END
        WHERE
            user_id = :id
        `,
        {
            replacements: {
                id,
            },
            transaction,
        },
    );
};
