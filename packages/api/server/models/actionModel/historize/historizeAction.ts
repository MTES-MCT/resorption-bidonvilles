import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default async (id: number, transaction: Transaction): Promise<number> => {
    const response = await sequelize.query(`
        INSERT INTO actions_history(
            action_id,
            name,
            started_at,
            ended_at,
            goals,
            fk_departement,
            location_type,
            address,
            latitude,
            longitude,
            location_other,
            created_by,
            created_at,
            updated_by,
            updated_at
        ) (SELECT
            action_id,
            name,
            started_at,
            ended_at,
            goals,
            fk_departement,
            location_type::text::enum_actions_history_location_type,
            address,
            latitude,
            longitude,
            location_other,
            created_by,
            created_at,
            updated_by,
            updated_at
        FROM actions WHERE action_id = :id)
        RETURNING hid
    `, {
        type: QueryTypes.INSERT,
        transaction,
        replacements: {
            id,
        },
    });
    type ReturnValue = { hid: number };
    const rows: ReturnValue[] = (response[0] as unknown) as ReturnValue[];

    return rows[0].hid;
};
