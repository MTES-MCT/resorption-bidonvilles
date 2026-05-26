import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default function insertOperators(actionId: number, operators: number[], transaction: Transaction) {
    return sequelize.query(
        `INSERT INTO action_operators(
            fk_action,
            fk_user
        ) VALUES ${operators.map(() => '(?, ?)').join(',')}`,
        {
            type: QueryTypes.INSERT,
            transaction,
            replacements: operators.flatMap(userId => [actionId, userId]),
        },
    );
}
