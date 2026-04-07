import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default async function historizeAddresses(actionId: number, actionHid: number, transaction: Transaction): Promise<void> {
    // Vérifier d'abord s'il y a des adresses à historiser
    const addresses = await sequelize.query(
        `SELECT action_address_id, fk_action, address, latitude, longitude, fk_city, created_at
        FROM action_addresses
        WHERE fk_action = :actionId`,
        {
            type: QueryTypes.SELECT,
            transaction,
            replacements: {
                actionId,
            },
        },
    );

    if (addresses.length === 0) {
        return;
    }

    await sequelize.query(
        `INSERT INTO action_addresses_history(
            action_address_id,
            fk_action,
            action_hid,
            address,
            latitude,
            longitude,
            fk_city,
            created_at
        ) (SELECT
            action_address_id,
            fk_action,
            :actionHid,
            address,
            latitude,
            longitude,
            fk_city,
            created_at
        FROM action_addresses
        WHERE fk_action = :actionId)`,
        {
            type: QueryTypes.INSERT,
            transaction,
            replacements: {
                actionId,
                actionHid,
            },
        },
    );
}
