import { sequelize } from '#db/sequelize';

export default async (id) => {
    const result = await sequelize.query(
        `SELECT
            organization_type_id AS id,
            name_singular,
            name_plural,
            abbreviation,
            fk_category AS organization_category
        FROM organization_types
        WHERE organization_type_id = :id`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                id,
            },
        },
    );

    return result.length === 1 ? result[0] : null;
};
