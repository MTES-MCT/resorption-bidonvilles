import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

type OperatorInput = {
    id: number,
    is_principal?: boolean
};

export default (actionId: number, operators: OperatorInput[], transaction: Transaction) => sequelize.query(
    `INSERT INTO action_operators(
        fk_action,
        fk_user,
        is_principal
    ) VALUES ${operators.map(() => '(?, ?, ?)').join(',')}`,
    {
        type: QueryTypes.INSERT,
        transaction,
        replacements: operators.map(op => [actionId, op.id, op.is_principal || false]).flat(),
    },
);
