import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async () => sequelize.query(
    `
      SELECT COUNT(*), departement_code as fk_departement 
      FROM users
      LEFT JOIN localized_organizations on users.fk_organization = localized_organizations.organization_id
      WHERE fk_status = 'active'
      GROUP BY fk_departement
      ORDER BY fk_departement
        `,
    {
        type: QueryTypes.SELECT,
    },
);
