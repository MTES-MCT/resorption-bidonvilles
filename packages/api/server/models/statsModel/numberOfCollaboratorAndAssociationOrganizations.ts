import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async () => {
    const rows = await sequelize.query(
        `SELECT
            organization_types.fk_category,
            COUNT(DISTINCT users.fk_organization) AS total
        FROM users
        LEFT JOIN organizations ON users.fk_organization = organizations.organization_id
        LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
        WHERE
            users.fk_status='active'
            AND
            organizations.active = TRUE
            AND
            organization_types.fk_category IN ('territorial_collectivity', 'association', 'public_establishment', 'administration')
        GROUP BY organization_types.fk_category`,
        {
            type: QueryTypes.SELECT,
        },
    );

    return rows.reduce((hash, row: any) => ({
        ...hash,
        [row.fk_category]: row.total,
    }), {});
};
