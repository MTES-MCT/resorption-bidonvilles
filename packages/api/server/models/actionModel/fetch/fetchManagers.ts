import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import ActionUserRow from './ActionUserRow.d';
import enrichWhere from './enrichWhere';

export default function fetchManagers(actionIds: number[] = null, clauseGroup: object = {}, transaction?: Transaction): Promise<ActionUserRow[]> {
    const where = [];
    const replacements = { actionIds };
    if (actionIds !== null) {
        where.push('action_managers.fk_action IN (:actionIds)');
    }

    enrichWhere(where, replacements, clauseGroup);

    return sequelize.query(
        `SELECT
            action_managers.fk_action AS action_id,
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
        FROM action_managers
        LEFT JOIN users ON action_managers.fk_user = users.user_id
        LEFT JOIN organizations ON users.fk_organization = organizations.organization_id
        LEFT JOIN roles_admin ON users.fk_role = roles_admin.role_id
        LEFT JOIN roles_regular ON users.fk_role_regular = roles_regular.role_id
        LEFT JOIN actions ON action_managers.fk_action = actions.action_id
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
