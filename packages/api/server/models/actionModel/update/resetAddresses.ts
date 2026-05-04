import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default async function resetAddresses(actionId: number, transaction: Transaction): Promise<void> {
    await sequelize.query(
        'DELETE FROM action_addresses WHERE fk_action = :actionId',
        {
            type: QueryTypes.DELETE,
            transaction,
            replacements: { actionId },
        },
    );
}
