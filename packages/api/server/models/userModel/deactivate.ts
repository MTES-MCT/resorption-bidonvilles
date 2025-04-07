import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

export default async (ids: number[], deactivationType: string = 'auto', anonymizationRequested: boolean = false, transaction: Transaction = undefined): Promise<void> => {
    await sequelize.query(
        `UPDATE
            users
        SET
            fk_status = 'inactive',
            updated_at = NOW(),
            deactivation_type = :deactivationType,
            anonymization_requested = :anonymizationRequested
        WHERE
            user_id IN (:ids)
        `,
        {
            replacements: {
                ids,
                deactivationType,
                anonymizationRequested,
            },
            transaction,
        },
    );
};
