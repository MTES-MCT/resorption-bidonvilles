import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import enrichWhere from '../fetch/enrichWhere';

export type ActionSelectRow = {
    id: number,
    name: string,
    shantytowns: number[],
    departement_code: string,
    departement_name: string,
    region_code: string,
    region_name: string,
    ended_at: number | null,
};

export default (shantytownIds: number[], clauseGroup: object = {}): Promise<ActionSelectRow[]> => {
    const where = ['action_shantytowns.fk_shantytown IN (:shantytownIds)'];
    const replacements = { shantytownIds };

    enrichWhere(where, replacements, clauseGroup);

    return sequelize.query(
        `SELECT
            actions.action_id AS id,
            actions.name,
            actions.ended_at,
            array_agg(action_shantytowns.fk_shantytown) AS shantytowns,
            departements.code AS departement_code,
            departements.name AS departement_name,
            regions.code AS region_code,
            regions.name AS region_name
        FROM actions
        LEFT JOIN action_shantytowns ON action_shantytowns.fk_action = actions.action_id
        LEFT JOIN departements ON actions.fk_departement = departements.code
        LEFT JOIN regions ON departements.fk_region = regions.code
        ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
        GROUP BY actions.action_id, actions.name, departement_code, departement_name, region_code, region_name`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                shantytownIds,
            },
        },
    );
};
