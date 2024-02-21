import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

type OrganizationTypeRaw = {
    id: number;
    name_singular: string;
    name_plural: string;
    abbreviation: string | null;
    fk_category: string;
};

export default async (id: number): Promise<OrganizationTypeRaw | null> => {
    const result: OrganizationTypeRaw[] = await sequelize.query(
        `SELECT
            organization_type_id AS id,
            name_singular,
            name_plural,
            abbreviation,
            fk_category AS organization_category
        FROM organization_types
        WHERE organization_type_id = :id`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                id,
            },
        },
    );

    return result.length === 1 ? result[0] : null;
};
