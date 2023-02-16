import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default (actionId: number, topics: string[], transaction: Transaction) => sequelize.query(
    `INSERT INTO action_topics(
        fk_action,
        fk_topic
    ) VALUES ${topics.map(() => '(?, ?)').join(',')}`,
    {
        type: QueryTypes.INSERT,
        transaction,
        replacements: topics.map(uid => [actionId, uid]).flat(),
    },
);
