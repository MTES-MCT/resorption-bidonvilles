import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default (id: number, hid: number, transaction: Transaction): Promise<[number, number]> => sequelize.query(`
INSERT INTO action_topics_history(
    fk_action,
    fk_topic
) (SELECT :hid, fk_topic FROM action_topics WHERE fk_action = :id)
`, {
    type: QueryTypes.INSERT,
    transaction,
    replacements: {
        id,
        hid,
    },
});
