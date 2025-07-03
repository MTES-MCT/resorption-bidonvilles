import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

type ActionActorRow = {
    user_id: number,
    first_name: string,
    last_name: string,
    email: string,
    action_id: number,
    action_name: string
};

type Action = {
    id: number,
    name: string
};

type ActionActor = {
    user_id: number,
    first_name: string,
    last_name: string,
    email: string,
    actions: Action[]
};

export default async (year: number, activeOnly: boolean = false): Promise<ActionActor[]> => {
    const rows: ActionActorRow[] = await sequelize.query(
        `
        SELECT
            users.user_id,
            users.first_name,
            users.last_name,
            users.email,
            t.fk_action AS action_id,
            actions.name AS action_name
        FROM (
            SELECT
                *
            FROM action_operators
            
            UNION
            
            SELECT
                *
            FROM action_managers
        ) t
        LEFT JOIN actions ON t.fk_action = actions.action_id
        LEFT JOIN users ON t.fk_user = users.user_id
        WHERE actions.started_at < :maxStartedAt AND (actions.ended_at IS NULL OR actions.ended_at >= :minEndedAt)
        ${activeOnly ? 'AND users.fk_active = \'active\'' : ''}
        `,
        {
            type: QueryTypes.SELECT,
            replacements: {
                maxStartedAt: `${year + 1}-01-01`,
                minEndedAt: `${year}-01-01`,
            },
        },
    );

    const hash: { [key: number]: ActionActor } = {};
    rows.forEach((row) => {
        hash[row.user_id] ??= {
            user_id: row.user_id,
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email,
            actions: [],
        };

        hash[row.user_id].actions.push({
            id: row.action_id,
            name: row.action_name,
        });
    });

    return Object.values(hash);
};
