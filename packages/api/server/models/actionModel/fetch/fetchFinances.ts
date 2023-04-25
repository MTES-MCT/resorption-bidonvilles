import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import ActionFinanceRow from './ActionFinanceRow.d';
import enrichWhere from './enrichWhere';

export default function fetchFinances(
    actionIds: number[] = null,
    clauseGroup: object = {},
    financeClauseGroup: object = {},
    transaction?: Transaction,
): Promise<ActionFinanceRow[]> {
    const where = [];
    const replacements = { actionIds };
    if (actionIds !== null) {
        where.push('action_finances.fk_action IN (:actionIds)');
    }

    enrichWhere(where, replacements, clauseGroup, 'action');
    enrichWhere(where, replacements, financeClauseGroup, 'action_finances');
    return sequelize.query(
        `SELECT
            action_finances.fk_action AS action_id,
            year,
            amount,
            real_amount,
            comments,
            action_finance_types.uid AS action_finance_type_uid,
            action_finance_types.name AS action_finance_type_name
        FROM action_finances
        LEFT JOIN action_finance_types ON action_finances.fk_action_finance_type = action_finance_types.uid
        LEFT JOIN actions ON action_finances.fk_action = actions.action_id
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
