import { Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default function resetMetrics(id: number, transaction: Transaction) {
    return sequelize.query(
        'DELETE FROM action_metrics WHERE fk_action = :id', {
            transaction,
            replacements: {
                id,
            },
        },
    );
}
