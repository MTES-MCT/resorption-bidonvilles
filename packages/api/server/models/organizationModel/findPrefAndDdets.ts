import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default shantytown => sequelize.query(
    `
       SELECT organizations.organization_id AS id
         FROM organizations
    LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
        WHERE     organization_types.uid IN (:types)
              AND (organizations.fk_region = :region OR organizations.fk_departement = :departement)`,
    {
        type: QueryTypes.SELECT,
        replacements: {
            types: ['pref_departement', 'pref_region', 'ddets'],
            region: shantytown.region.code,
            departement: shantytown.departement.code,
        },
    },
);
