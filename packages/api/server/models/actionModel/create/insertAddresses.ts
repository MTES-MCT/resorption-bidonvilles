import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import { ActionEnrichedInput } from '#server/services/action/ActionInput.d';

export default async function insertAddresses(actionId: number, data: ActionEnrichedInput, transaction: Transaction): Promise<void> {
    if (data.location_type !== 'eti' || !data.location_eti_addresses || data.location_eti_addresses.length === 0) {
        return;
    }

    const values = data.location_eti_addresses.map((_, index) => `(:actionId, :address${index}, :latitude${index}, :longitude${index}, :citycode${index}, NOW())`).join(', ');

    const replacements: any = { actionId };
    data.location_eti_addresses.forEach((address, index) => {
        replacements[`address${index}`] = address.address;
        replacements[`latitude${index}`] = address.latitude;
        replacements[`longitude${index}`] = address.longitude;
        replacements[`citycode${index}`] = address.citycode;
    });

    await sequelize.query(
        `INSERT INTO action_addresses(
            fk_action,
            address,
            latitude,
            longitude,
            fk_city,
            created_at
        ) VALUES ${values}`,
        {
            type: QueryTypes.INSERT,
            transaction,
            replacements,
        },
    );
}
