import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import enrichWhere from '../fetch/enrichWhere';

export type ActionSelectRow = {
    shantytown_id: number,
    action_id: number,
    action_year: number,
    financed: boolean,
};

export default (shantytownIds: number[] | null, annee_action: number, clauseGroup: object = {}): Promise<ActionSelectRow[]> => {
    const where = [];

    const replacements = {
        shantytownIds,
        annee: annee_action,
    };
    if (shantytownIds !== null) {
        where.push('as2.fk_shantytown IN (:shantytownIds)');
    }
    if (annee_action !== null) {
        where.push('af."year" = :annee::integer');
    }
    where.push('af.amount > 0');

    enrichWhere(where, replacements, clauseGroup);

    return sequelize.query(
        `
        SELECT
            ash.fk_shantytown as "shantytown_id",
            af.fk_action as "action_id",
            af."year" as "action_year",
            CASE
                WHEN
                    SUM(CASE WHEN af.fk_action_finance_type = 'etatique' THEN af.amount ELSE 0 END) +
                    SUM(CASE WHEN af.fk_action_finance_type = 'dedie' THEN af.amount ELSE 0 END) +
                    SUM(CASE WHEN af.fk_action_finance_type = 'collectivite' THEN af.amount ELSE 0 END) +
                    SUM(CASE WHEN af.fk_action_finance_type = 'europeen' THEN af.amount ELSE 0 END) +
                    SUM(CASE WHEN af.fk_action_finance_type = 'prive' THEN af.amount ELSE 0 END) +
                    SUM(CASE WHEN af.fk_action_finance_type = 'autre' THEN af.amount ELSE 0 END) > 0
                THEN true
                ELSE false
            END as "financed"
        FROM
            action_shantytowns ash
        LEFT JOIN
            action_finances as af ON af.fk_action = ash.fk_action
        ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
        GROUP BY 1, 2, 3
        ORDER BY 1, 2
        `,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );
};
