import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default function resetAddresses(actionId: number, transaction: Transaction) {
    return sequelize.query(
        'DELETE FROM action_addresses WHERE fk_action = :actionId',
        {
            type: QueryTypes.DELETE,
            transaction,
            replacements: { actionId },
        },
    );
}
