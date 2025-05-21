import { sequelize } from '#db/sequelize';
import { Transaction, QueryTypes } from 'sequelize';

interface UserStatus {
    user_id: number;
    fk_status: string;
}


export default async (ids: number[], deactivationType: string = 'auto', anonymizationRequested: boolean = false, transaction: Transaction = undefined): Promise<UserStatus[]> => {
    const updatedUsers = await sequelize.query(
        `UPDATE
            users
        SET
            fk_status = 'inactive',
            updated_at = NOW(),
            deactivation_type = :deactivationType,
            anonymization_requested = :anonymizationRequested,
            deactivated_at = NOW()
        WHERE
            user_id IN (:ids)
        RETURNING user_id, fk_status
        `,
        {
            replacements: {
                ids,
                deactivationType,
                anonymizationRequested,
            },
            type: QueryTypes.SELECT,
            transaction,
        },
    ) as UserStatus[];

    return updatedUsers;
};
