import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

type OrganizationCategoryRaw = {
    uid: string;
    name_singular: string;
    name_plural: string;
};

export default async (uid: string): Promise<OrganizationCategoryRaw | null> => {
    const result: OrganizationCategoryRaw[] = await sequelize.query(
        `SELECT
            uid,
            name_singular,
            name_plural
        FROM organization_categories
        WHERE uid = :uid`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                uid,
            },
        },
    );

    return result.length === 1 ? result[0] : null;
};
