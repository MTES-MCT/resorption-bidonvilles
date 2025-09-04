import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { ParcelOwnerInsert } from '#root/types/resources/ParcelOwner.d';

interface ShantytownParcelOwnerCreationResult {
    shantytown_parcel_owner_id: number;
}

export default async (user: AuthUser, shantytownId: number, owners: ParcelOwnerInsert[], argTransaction: Transaction | undefined = undefined): Promise<number[]> => {
    let transaction: Transaction = argTransaction;
    transaction ??= await sequelize.transaction();

    if (!owners || owners.length === 0) {
        throw new ServiceError('invalid_data', new Error('Au moins un propriétaire de parcelle doit être fourni'));
    }

    try {
        const results = await sequelize.query<ShantytownParcelOwnerCreationResult>(
            `
                INSERT INTO shantytown_parcel_owners
                    (fk_shantytown, owner_name, fk_owner_type, fk_user)
                VALUES
                    ${owners.map(() => '(?, ?, ?, ?)').join(', ')}
                RETURNING shantytown_parcel_owner_id
            `,
            {
                replacements: owners.flatMap(
                    owner => [shantytownId, owner.name, owner.type, user.id],
                ),
                transaction,
                type: QueryTypes.SELECT,
            },
        );

        return results.map(r => r.shantytown_parcel_owner_id);
    } catch (error) {
        throw new ServiceError('parcel_owner_creation_failed', error);
    }
};
