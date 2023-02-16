import { Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default (id: number, transaction: Transaction) => sequelize.query(
    'DELETE FROM action_topics WHERE fk_action = :id', {
        transaction,
        replacements: {
            id,
        },
    },
);
