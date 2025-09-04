import { sequelize } from '#db/sequelize';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { RawParcelOwner } from '#root/types/resources/ParcelOwner.d';

export default async (user: AuthUser, shantytownId: number): Promise<RawParcelOwner[]> => {
    try {
        const [results]: any = await sequelize.query(`
            SELECT * FROM shantytown_parcel_owners WHERE fk_shantytown = :shantytownId
        `, {
            replacements: { shantytownId },
        });
        return results;
    } catch (error) {
        throw new ServiceError('parcel_owner_fetch_failed', new Error(error?.message));
    }
};
