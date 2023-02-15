import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';
import { ActionUpdateInput } from '#server/services/action/ActionInput.d';

export default (id: number, data: ActionUpdateInput, transaction: Transaction) => sequelize.query(
    `UPDATE actions SET
        name = :name,
        started_at = :started_at,
        ended_at = :ended_at,
        updated_at = NOW(),
        goals = :goals,
        fk_departement = :location_departement,
        location_type = :location_type,
        address = :address,
        latitude = :latitude,
        longitude = :longitude,
        eti_fk_city = :location_eti_citycode,
        location_other = :location_autre,
        updated_by = :updated_by
    WHERE action_id = :id`,
    {
        type: QueryTypes.UPDATE,
        transaction,
        replacements: {
            id,
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
            updated_by: data.updated_by,
        },
    },
);
