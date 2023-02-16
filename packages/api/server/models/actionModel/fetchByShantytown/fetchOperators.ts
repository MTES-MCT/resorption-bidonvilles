import { QueryTypes } from 'sequelize';
import { sequelize } from '#db/sequelize';
import ActionUserRow from '../fetch/ActionUserRow';
import enrichWhere from '../fetch/enrichWhere';

export default function fetchTopics(shantytownIds: number[], clauseGroup: object = {}): Promise<ActionUserRow[]> {
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
            action_operators.fk_action AS action_id,
            users.user_id AS id,
            users.email,
            users.first_name,
            users.last_name,
            users.position,
            users.phone,
            roles_admin.name AS admin_role_name,
            roles_regular.name AS regular_role_name,
            organizations.organization_id,
            organizations.name AS organization_name,
            organizations.abbreviation AS organization_abbreviation
        FROM _actions AS actions
        LEFT JOIN action_operators ON action_operators.fk_action = actions.action_id
        LEFT JOIN users ON action_operators.fk_user = users.user_id
        LEFT JOIN organizations ON users.fk_organization = organizations.organization_id
        LEFT JOIN roles_admin ON users.fk_role = roles_admin.role_id
        LEFT JOIN roles_regular ON users.fk_role_regular = roles_regular.role_id
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
