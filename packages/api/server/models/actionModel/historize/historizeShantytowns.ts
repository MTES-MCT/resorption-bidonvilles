import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default (id: number, hid: number, transaction: Transaction): Promise<[number, number]> => sequelize.query(`
INSERT INTO action_shantytowns_history(
    fk_action,
    fk_shantytown
) (SELECT :hid, fk_shantytown FROM action_shantytowns WHERE fk_action = :id)
`, {
    type: QueryTypes.INSERT,
    transaction,
    replacements: {
        id,
        hid,
    },
});
