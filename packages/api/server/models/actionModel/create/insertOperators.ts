import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

type OperatorInput = {
    id: number,
    is_principal?: boolean
};

export default function insertOperators(actionId: number, operators: OperatorInput[], transaction: Transaction) {
    return sequelize.query(
        `INSERT INTO action_operators(
            fk_action,
            fk_user,
            is_principal
        ) VALUES ${operators.map(() => '(?, ?, ?)').join(',')}`,
        {
            type: QueryTypes.INSERT,
            transaction,
            replacements: operators.flatMap(op => [actionId, op.id, op.is_principal || false]),
        },
    );
}
