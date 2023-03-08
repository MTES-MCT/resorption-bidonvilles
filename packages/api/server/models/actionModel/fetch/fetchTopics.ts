import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import enrichWhere from './enrichWhere';

export type ActionTopicRow = {
    action_id: number,
    uid: string,
    name: string,
};

export default function fetchTopics(actionIds: number[] = null, clauseGroup: object = {}, transaction?: Transaction): Promise<ActionTopicRow[]> {
    const where = [];
    const replacements = { actionIds };
    if (actionIds !== null) {
        where.push('action_topics.fk_action IN (:actionIds)');
    }

    enrichWhere(where, replacements, clauseGroup);

    return sequelize.query(
        `SELECT
            action_topics.fk_action AS action_id,
            topics.uid,
            topics.name
        FROM action_topics
        LEFT JOIN topics ON action_topics.fk_topic = topics.uid
        LEFT JOIN actions ON action_topics.fk_action = actions.action_id
        LEFT JOIN departements ON actions.fk_departement = departements.code
        LEFT JOIN regions ON departements.fk_region = regions.code
        ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
        `,
        {
            type: QueryTypes.SELECT,
            replacements,
            transaction,
        },
    );
}
