import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';
import ServiceError from '#server/errors/ServiceError';

export default async (shantytownId: number, ownerIds: number[], argTransaction: Transaction | undefined = undefined): Promise<boolean> => {
    let transaction: Transaction = argTransaction;
    transaction ??= await sequelize.transaction();

    if (!ownerIds || ownerIds.length === 0) {
        throw new ServiceError('invalid_data', new Error('Au moins un propriétaire de parcelle doit être fourni'));
    }

    try {
        await sequelize.query(`
             DELETE FROM shantytown_parcel_owners
            WHERE shantytown_parcel_owner_id IN (:ownerIds) AND fk_shantytown = :shantytownId
        `, {
            replacements: {
                ownerIds,
                shantytownId,
            },
            transaction,
        });
        return true;
    } catch (error) {
        throw new ServiceError('parcel_owner_creation_failed', new Error(error?.message));
    }
};
