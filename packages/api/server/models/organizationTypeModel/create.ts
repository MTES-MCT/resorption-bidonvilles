import { Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import toSnakeCase from '#server/utils/toSnakeCase';

type OrganizationTypeCreateData = {
    category: string,
    name: string,
    abbreviation: string,
    default_role: string,
};

export default async (createdBy: number, data: OrganizationTypeCreateData, transaction?: Transaction): Promise<number> => {
    const response = await sequelize.query(
        `INSERT INTO organization_types (
            name_singular,
            name_plural,
            abbreviation,
            fk_category,
            fk_role,
            uid,
            created_by
        )
        VALUES (
            :name,
            :name,
            :abbreviation,
            :category,
            :default_role,
            :uid,
            :createdBy
        )
        RETURNING organization_type_id`,
        {
            replacements: {
                name: data.name,
                abbreviation: data.abbreviation,
                category: data.category,
                default_role: data.default_role,
                uid: toSnakeCase(data.name),
                createdBy,
            },
            transaction,
        },
    );

    type ReturnValue = { organization_type_id: number };
    const rows: ReturnValue[] = (response[0] as unknown) as ReturnValue[];

    return rows[0].organization_type_id;
};
