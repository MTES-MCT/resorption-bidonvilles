import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default (id: number, hid: number, transaction: Transaction): Promise<[number, number]> => sequelize.query(`
INSERT INTO action_finances_history(
    fk_action,
    year,
    fk_action_finance_type,
    amount,
    real_amount,
    comments
) (SELECT :hid, year, fk_action_finance_type, amount, real_amount, comments FROM action_finances WHERE fk_action = :id)
`, {
    type: QueryTypes.INSERT,
    transaction,
    replacements: {
        id,
        hid,
    },
});
