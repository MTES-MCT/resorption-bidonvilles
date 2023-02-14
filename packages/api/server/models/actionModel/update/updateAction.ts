import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';
import { ActionUpdateRow } from './ActionUpdateRow';

export default (id: number, data: ActionUpdateRow, transaction: Transaction) => sequelize.query(
    `UPDATE actions SET
        name = :name,
        started_at = :started_at,
        ended_at = :ended_at,
        goals = :goals,
        fk_departement = :location_departement,
        location_type = :location_type,
        address = :address,
        latitude = :latitude,
        longitude = :longitude,
        eti_fk_city = :location_eti_citycode,
        location_other = :location_autre,
        updated_by = :updated_by,
        updated_at = NOW()
    WHERE action_id = :id`,
    {
        type: QueryTypes.UPDATE,
        transaction,
        replacements: {
            ...data,
            id,
        },
    },
);
