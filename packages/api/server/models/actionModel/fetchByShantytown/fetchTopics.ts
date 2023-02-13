import { QueryTypes } from 'sequelize';
import { sequelize } from '#db/sequelize';
import { ActionTopicRow } from '../fetch/fetchTopics';
import enrichWhere from '../fetch/enrichWhere';

export default function fetchTopics(shantytownIds: number[], clauseGroup: object = {}): Promise<ActionTopicRow[]> {
    const where = [];
    const replacements = { shantytownIds };

    enrichWhere(where, replacements, clauseGroup);

    return sequelize.query(
        `WITH _actions AS (SELECT
            actions.action_id,
            actions.fk_departement,
            array_agg(action_shantytowns.fk_shantytown) AS shantytowns
        FROM actions
        LEFT JOIN action_shantytowns ON action_shantytowns.fk_action = actions.action_id
        WHERE action_shantytowns.fk_shantytown IN (:shantytownIds)
        GROUP BY actions.action_id)
        
        SELECT
            action_topics.fk_action AS action_id,
            topics.uid,
            topics.name
        FROM _actions AS actions
        LEFT JOIN action_topics ON action_topics.fk_action = actions.action_id
        LEFT JOIN topics ON action_topics.fk_topic = topics.uid
        LEFT JOIN departements ON actions.fk_departement = departements.code
        LEFT JOIN regions ON departements.fk_region = regions.code
        ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
        `,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );
}
