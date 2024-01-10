import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { ElectricityType } from '#root/types/resources/ElectricityType.d';

export default async (): Promise<ElectricityType[]> => sequelize.query(
    `SELECT
        electricity_types.electricity_type_id AS id,
        electricity_types.label AS label,
        electricity_types.position AS position,
        electricity_types.uid AS uid
    FROM electricity_types
    ORDER BY position ASC`,
    {
        type: QueryTypes.SELECT,
    },
);
