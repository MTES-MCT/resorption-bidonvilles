import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { OwnerType } from '#root/types/resources/OwnerType.d';

export default async (id: number): Promise<OwnerType> => {
    const rows: OwnerType[] = await sequelize.query(
        `SELECT
            owner_types.owner_type_id AS id,
            owner_types.label AS label,
            owner_types.position AS position
        FROM owner_types
        WHERE owner_types.owner_type_id = :id
        ORDER BY position ASC`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                id,
            },
        },
    );

    if (rows.length !== 1) {
        return null;
    }

    return rows[0];
};
