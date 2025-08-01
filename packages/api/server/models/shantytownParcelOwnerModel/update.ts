import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { ParcelOwnerInsert, RawParcelOwner } from '#root/types/resources/ParcelOwner.d';

export default async (user: AuthUser, shantytownId: number, owners: ParcelOwnerInsert[], transaction: Transaction | undefined = undefined): Promise<RawParcelOwner[]> => {
    // let transaction: Transaction = argTransaction;
    // transaction ??= await sequelize.transaction();

    if (!owners || owners.length === 0) {
        throw new ServiceError('invalid_data', new Error('Au moins un propriétaire de parcelle doit être fourni'));
    }

    const {
        ids, names, types, actives,
    } = owners.reduce((acc, owner) => {
        acc.ids.push(owner.ownerId);
        acc.names.push(owner.name);
        acc.types.push(owner.type);
        acc.actives.push(owner.active ?? true); // true par défaut
        return acc;
    }, {
        ids: [] as ParcelOwnerInsert['ownerId'][], names: [] as ParcelOwnerInsert['name'][], types: [] as ParcelOwnerInsert['type'][], actives: [] as boolean[],
    });

    try {
        const [results]: [any[], any] = await sequelize.query(`
            UPDATE
                shantytown_parcel_owners AS t
            SET 
                owner_name = owner_data.name,
                fk_owner_type = owner_data.type,
                active = owner_data.active
            FROM (
                SELECT
                    u_id.id,
                    u_name.name,
                    u_type.type,
                    u_active.active
                FROM
                    unnest($ids::int[]) WITH ORDINALITY AS u_id(id, ord)
                JOIN
                    unnest($names::text[]) WITH ORDINALITY AS u_name(name, ord) ON u_id.ord = u_name.ord
                JOIN
                    unnest($types::int[]) WITH ORDINALITY AS u_type(type, ord) ON u_id.ord = u_type.ord
                JOIN
                    unnest($actives::boolean[]) WITH ORDINALITY AS u_active(active, ord) ON u_id.ord = u_active.ord
            ) AS owner_data
            WHERE
                t.shantytown_parcel_owner_id = owner_data.id
            RETURNING t.*;`, {
            bind: {
                ids,
                names,
                types,
                actives,
            },
            transaction,
        });

        return results;
    } catch (error) {
        throw new ServiceError('parcel_owner_update_failed', new Error(error?.message));
    }
};
