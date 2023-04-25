import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import enrichWhere from './enrichWhere';

export type ActionShantytownRow = {
    action_id: number,
    id: number | null,
    address: string | null,
    name: string | null,
    closed_at: Date | null,
    field_type_id: number,
    field_type_label: string,
    city_name: string
};

export default function fetchShantytowns(actionIds: number[] = null, clauseGroup: object = {}, transaction?: Transaction): Promise<ActionShantytownRow[]> {
    const where = [];
    const replacements = { actionIds };
    if (actionIds !== null) {
        where.push('action_shantytowns.fk_action IN (:actionIds)');
    }

    enrichWhere(where, replacements, clauseGroup);

    return sequelize.query(
        `SELECT
            action_shantytowns.fk_action AS action_id,
            shantytowns.shantytown_id AS id,
            shantytowns.address,
            shantytowns.name,
            shantytowns.closed_at,
            shantytown_cities.name AS city_name,
            field_types.field_type_id,
            field_types.label AS field_type_label
        FROM action_shantytowns
        LEFT JOIN shantytowns ON action_shantytowns.fk_shantytown = shantytowns.shantytown_id
        LEFT JOIN cities AS shantytown_cities ON shantytowns.fk_city = shantytown_cities.code
        LEFT JOIN field_types ON shantytowns.fk_field_type = field_types.field_type_id
        LEFT JOIN actions ON action_shantytowns.fk_action = actions.action_id
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
