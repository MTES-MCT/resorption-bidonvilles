import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default (actionId: number, shantytowns: number[], transaction: Transaction) => sequelize.query(
    `INSERT INTO action_shantytowns(
        fk_action,
        fk_shantytown
    ) VALUES ${shantytowns.map(() => '(?, ?)').join(',')}`,
    {
        type: QueryTypes.INSERT,
        transaction,
        replacements: shantytowns.map(shantytownId => [actionId, shantytownId]).flat(),
    },
);
