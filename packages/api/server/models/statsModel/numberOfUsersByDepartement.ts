import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

type NumberOfUsersByDepartementRow = {
    count: number,
    departement_code: string,
};

export default (): Promise<NumberOfUsersByDepartementRow[]> => sequelize.query(
    `
        SELECT
            COUNT(*) AS count,
            COALESCE(intervention_areas.fk_departement, cities.fk_departement, epci_to_departement.fk_departement) AS departement_code
        FROM users
        LEFT JOIN intervention_areas ON intervention_areas.fk_user = users.user_id OR (users.use_custom_intervention_area IS FALSE AND intervention_areas.fk_organization = users.fk_organization)
        LEFT JOIN cities ON intervention_areas.fk_city = cities.code
        LEFT JOIN epci_to_departement ON intervention_areas.fk_epci = epci_to_departement.fk_epci
        WHERE users.fk_status = 'active' AND users.to_be_tracked IS TRUE AND intervention_areas.is_main_area IS TRUE
        AND COALESCE(intervention_areas.fk_departement, cities.fk_departement, epci_to_departement.fk_departement) IS NOT NULL
        GROUP BY departement_code
        ORDER BY departement_code
        `,
    {
        type: QueryTypes.SELECT,
    },
);
