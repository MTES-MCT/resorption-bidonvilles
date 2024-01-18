import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import { RawInterventionArea } from '#server/models/userModel/_common/query.d';

export default (userIds: number[], organizationIds: number[], transaction: Transaction = undefined): Promise<RawInterventionArea[]> => {
    const where = [];
    if (userIds.length > 0) {
        where.push('intervention_areas.fk_user IN (:userIds)');
    }
    if (organizationIds.length > 0) {
        where.push('intervention_areas.fk_organization IN (:organizationIds)');
    }

    return sequelize.query(
        `SELECT DISTINCT
            intervention_areas.fk_user,
            intervention_areas.fk_organization,
            intervention_areas.type,
            intervention_areas.is_main_area,
            COALESCE(r1.code, r2.code, r3.code, r4.code) AS region_code,
            COALESCE(r1.name, r2.name, r3.name, r4.name) AS region_name,
            COALESCE(d1.code, d2.code, d3.code) AS departement_code,
            COALESCE(d1.name, d2.name, d3.name) AS departement_name,
            COALESCE(e1.code, e2.code) AS epci_code,
            COALESCE(e1.name, e2.name) AS epci_name,
            c1.code AS city_code,
            c1.name AS city_name,
            c1.fk_main AS city_main,
            COALESCE(c1.latitude, d2.latitude, d3.latitude, r4.latitude) AS latitude,
            COALESCE(c1.longitude, d2.longitude, d3.longitude, r4.longitude) AS longitude
        FROM intervention_areas
        
        -- niveau 'city'
        LEFT JOIN cities c1 ON intervention_areas.fk_city = c1.code
        LEFT JOIN departements d1 ON c1.fk_departement = d1.code
        LEFT JOIN epci e1 ON c1.fk_epci = e1.code
        LEFT JOIN regions r1 ON d1.fk_region = r1.code
        
        -- niveau 'epci'
        LEFT JOIN epci e2 ON intervention_areas.fk_epci = e2.code
        LEFT JOIN epci_to_departement ON e2.code = epci_to_departement.fk_epci
        LEFT JOIN departements d2 ON epci_to_departement.fk_departement = d2.code
        LEFT JOIN regions r2 ON d2.fk_region = r2.code
        
        -- niveau 'departement'
        LEFT JOIN departements d3 ON intervention_areas.fk_departement = d3.code
        LEFT JOIN regions r3 ON d3.fk_region = r3.code
        
        -- niveau 'region'
        LEFT JOIN regions r4 ON intervention_areas.fk_region = r4.code
        
        ${where.length > 0 ? `WHERE ${where.join(' OR ')}` : ''}`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                userIds,
                organizationIds,
            },
            transaction,
        },
    );
};
