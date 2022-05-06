import { sequelize } from '#db/sequelize';

export default async (id) => {
    const result = await sequelize.query(
        `SELECT
            organizations.organization_id AS id,
            organizations.name,
            organizations.fk_type,
            organizations.being_funded,
            organizations.being_funded_at,
            organization_types.fk_category
        FROM organizations
        LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
        WHERE organizations.organization_id = :id`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                id,
            },
        },
    );

    return result.length === 1 ? result[0] : null;
};
