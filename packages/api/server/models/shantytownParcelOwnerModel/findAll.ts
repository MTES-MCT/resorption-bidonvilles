import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { RawParcelOwner } from '#root/types/resources/ParcelOwner.d';

export default async (user: AuthUser, shantytownId: number, argTransaction: Transaction | undefined = undefined): Promise<RawParcelOwner[]> => {
    let transaction: Transaction = argTransaction;
    transaction ??= await sequelize.transaction();

    try {
        const [results]: any = await sequelize.query(`
            SELECT * FROM shantytown_parcel_owners WHERE fk_shantytown = :shantytownId
        `, {
            replacements: { shantytownId },
            transaction,
        });

        if (argTransaction === undefined) {
            await transaction.commit();
        }
        return results;
    } catch (error) {
        if (argTransaction === undefined) {
            await transaction.rollback();
        }
        throw new ServiceError('parcel_owner_fetch_failed', new Error(error?.message));
    }
};
