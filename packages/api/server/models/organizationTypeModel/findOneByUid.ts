import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (uid: string): Promise<{ id: number, name: string }> => {
    const results: { id: number, name: string }[] = await sequelize.query(
        `SELECT
            organization_type_id as id,
            name_singular
        FROM organization_types
        WHERE organization_types.uid = :uid`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                uid,
            },
        },
    );

    if (results.length !== 1) {
        return null;
    }

    return results[0];
};
