import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import { ActionCreateInput } from '#server/services/action/ActionInput.d';

export default async (data: ActionCreateInput, transaction: Transaction): Promise<number> => {
    const actionResponse = await sequelize.query(`INSERT INTO actions(
        name,
        started_at,
        ended_at,
        goals,
        fk_departement,
        location_type,
        address,
        latitude,
        longitude,
        eti_fk_city,
        location_other,
        created_by
    ) VALUES (
        :name,
        :started_at,
        :ended_at,
        :goals,
        :location_departement,
        :location_type,
        :address,
        :latitude,
        :longitude,
        :location_eti_citycode,
        :location_autre,
        :created_by
    ) RETURNING action_id`, {
        type: QueryTypes.INSERT,
        transaction,
        replacements: {
            name: data.name,
            started_at: data.started_at,
            ended_at: data.ended_at,
            goals: data.goals,
            location_departement: data.location_departement,
            location_type: data.location_type,
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude,
            location_eti_citycode: data.location_eti_citycode,
            location_autre: data.location_autre,
            created_by: data.created_by,
        },
    });

    type ReturnValue = { action_id: number };
    const rows: ReturnValue[] = (actionResponse[0] as unknown) as ReturnValue[];
    return rows[0].action_id;
};
