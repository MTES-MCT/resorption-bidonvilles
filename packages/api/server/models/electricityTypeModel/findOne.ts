import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { ElectricityType } from '#root/types/resources/ElectricityType.d';

export default async (id: number): Promise<ElectricityType> => {
    const electricityTypes: ElectricityType[] = await sequelize.query(
        `SELECT
            electricity_types.electricity_type_id AS id,
            electricity_types.label AS label,
            electricity_types.position AS position,
            electricity_types.uid AS uid
        FROM electricity_types
        WHERE electricity_types.electricity_type_id = :id`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                id,
            },
        },
    );

    if (electricityTypes.length !== 1) {
        return null;
    }

    return electricityTypes[0];
};
