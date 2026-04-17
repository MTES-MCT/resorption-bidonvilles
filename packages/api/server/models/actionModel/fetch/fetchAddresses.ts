import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export type ActionAddressRow = {
    action_id: number,
    action_address_id: number,
    address: string,
    latitude: number,
    longitude: number,
    fk_city: string,
};

export default function fetchAddresses(actionIds?: number[], transaction?: Transaction): Promise<ActionAddressRow[]> {
    if (!actionIds || actionIds.length === 0) {
        // Pour la liste (actionIds = null), charger toutes les adresses ETI
        return sequelize.query(
            `SELECT
                fk_action AS action_id,
                action_address_id,
                address,
                latitude,
                longitude,
                fk_city
            FROM action_addresses
            WHERE fk_action IN (
                SELECT action_id FROM actions 
                WHERE location_type = 'eti'
            )
            ORDER BY action_address_id ASC`,
            {
                type: QueryTypes.SELECT,
                transaction,
            },
        );
    }

    return sequelize.query(
        `SELECT
            fk_action AS action_id,
            action_address_id,
            address,
            latitude,
            longitude,
            fk_city
        FROM action_addresses
        WHERE fk_action IN (:actionIds)
        ORDER BY action_address_id ASC`,
        {
            type: QueryTypes.SELECT,
            replacements: { actionIds },
            transaction,
        },
    );
}
