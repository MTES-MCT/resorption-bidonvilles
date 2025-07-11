import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';

export default async (user: AuthUser, shantytownId: number, argTransaction: Transaction | undefined = undefined) => {
    let transaction: Transaction = argTransaction;
    transaction ??= await sequelize.transaction();

    try {
        const [results]: any = await sequelize.query(`
            SELECT * FROM shantytown_parcel_owners WHERE fk_shantytown = :shantytownId
        `, {
            replacements: { shantytownId },
            transaction,
        });

        return results;
    } catch (error) {
        throw new ServiceError('parcel_owner_fetch_failed', new Error(error?.message));
    }
};
