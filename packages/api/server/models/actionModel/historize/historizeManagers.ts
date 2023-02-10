import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default (id: number, hid: number, transaction: Transaction): Promise<[number, number]> => sequelize.query(`
INSERT INTO action_managers_history(
    fk_action,
    fk_user
) (SELECT :hid, fk_user FROM action_managers WHERE fk_action = :id)
`, {
    type: QueryTypes.INSERT,
    transaction,
    replacements: {
        id,
        hid,
    },
});
