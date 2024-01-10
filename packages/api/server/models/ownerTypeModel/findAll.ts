import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { OwnerType } from '#root/types/resources/OwnerType.d';

export default (): Promise<OwnerType[]> => sequelize.query(
    `SELECT
        owner_types.owner_type_id AS id,
        owner_types.label AS label,
        owner_types.position AS position
    FROM owner_types
    ORDER BY position ASC`,
    {
        type: QueryTypes.SELECT,
    },
);
