import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import { ActionFinances } from '#server/services/action/ActionInput.d';

export default (actionId: number, finances: ActionFinances, transaction: Transaction) => Promise.all(
    Object.keys(finances).map(year => finances[parseInt(year, 10)].map(row => sequelize.query(
        `INSERT INTO action_finances (
            fk_action,
            year,
            fk_action_finance_type,
            amount,
            real_amount,
            comments
        ) VALUES (
            :fk_action,
            :year,
            :fk_action_finance_type,
            :amount,
            :real_amount,
            :comments
        )`,
        {
            type: QueryTypes.INSERT,
            transaction,
            replacements: {
                fk_action: actionId,
                year: parseInt(year, 10),
                fk_action_finance_type: row.finance_type,
                amount: row.amount,
                real_amount: row.real_amount,
                comments: row.comments,
            },
        },
    ))).flat(),
);
