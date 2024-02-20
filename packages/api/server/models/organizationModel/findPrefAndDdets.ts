import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default shantytown => sequelize.query(
    `
       SELECT organizations.organization_id AS id
         FROM organizations
    LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
    LEFT JOIN intervention_areas ON intervention_areas.fk_organization = organizations.organization_id
        WHERE     organization_types.uid IN (:types)
              AND (intervention_areas.fk_region = :region OR intervention_areas.fk_departement = :departement)`,
    {
        type: QueryTypes.SELECT,
        replacements: {
            types: ['pref_departement', 'pref_region', 'ddets'],
            region: shantytown.region.code,
            departement: shantytown.departement.code,
        },
    },
);
