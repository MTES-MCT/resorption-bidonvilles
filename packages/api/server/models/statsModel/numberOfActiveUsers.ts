import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async () => {
    const rows: any = await sequelize.query(
        `SELECT
            COUNT(*) AS total
        FROM users
        LEFT JOIN localized_organizations AS organizations ON users.fk_organization = organizations.organization_id
        WHERE
            users.fk_status='active'
            AND
            organizations.active = TRUE
        `,
        {
            type: QueryTypes.SELECT,
        },
    );

    return rows[0].total;
};
