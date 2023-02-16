import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default (actionId: number, managers: number[], transaction: Transaction) => sequelize.query(
    `INSERT INTO action_managers(
        fk_action,
        fk_user
    ) VALUES ${managers.map(() => '(?, ?)').join(',')}`,
    {
        type: QueryTypes.INSERT,
        transaction,
        replacements: managers.map(userId => [actionId, userId]).flat(),
    },
);
