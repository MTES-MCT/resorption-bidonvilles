import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { ParcelOwnerInsert } from '#root/types/resources/ParcelOwner.d';

export default async (user: AuthUser, shantytownId: number, owners: ParcelOwnerInsert[], argTransaction: Transaction | undefined = undefined) => {
    let transaction: Transaction = argTransaction;
    transaction ??= await sequelize.transaction();

    if (!owners || owners.length === 0) {
        throw new ServiceError('invalid_data', new Error('Au moins un propriétaire de parcelle doit être fourni'));
    }

    const { names, types } = owners.reduce((acc, owner) => {
        acc.names.push(owner.name);
        acc.types.push(owner.type);
        return acc;
    }, { names: [] as ParcelOwnerInsert['name'][], types: [] as ParcelOwnerInsert['type'][] });

    try {
        const [results]: [any[], any] = await sequelize.query(`
            INSERT INTO shantytown_parcel_owners (fk_shantytown, owner_name, fk_owner_type, fk_user)
        SELECT
            ${shantytownId},
            u_name.name,
            u_type.type,
            ${user.id}
        FROM
            unnest($names::text[]) WITH ORDINALITY AS u_name(name, ord)
        JOIN
            unnest($types::int[]) WITH ORDINALITY AS u_type(type, ord) ON u_name.ord = u_type.ord
        RETURNING shantytown_parcel_owner_id, fk_shantytown, owner_name, fk_owner_type;
    `, {
            bind: {
                names,
                types,
            },
            transaction,
        });
        return results.map(r => r.shantytown_parcel_owner_id);
    } catch (error) {
        throw new ServiceError('parcel_owner_creation_failed', new Error(error?.message));
    }
};
