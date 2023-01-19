import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (departement) => {
    const rows: any = await sequelize.query(
        `
        SELECT COUNT(*) from users
        LEFT JOIN localized_organizations on users.fk_organization = localized_organizations.organization_id
        WHERE fk_status = 'active'
        AND to_be_tracked = TRUE
        ${departement ? `AND departement_code = '${departement}'` : ''}
        `,
        {
            type: QueryTypes.SELECT,
        },
    );

    return rows[0].count;
};
