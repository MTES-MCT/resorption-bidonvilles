import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async () => {
    const rows: any = await sequelize.query(
        `SELECT COUNT(DISTINCT COALESCE(intervention_areas.fk_departement, cities.fk_departement, epci_to_departement.fk_departement)) as total
        FROM users
        LEFT JOIN intervention_areas ON
          intervention_areas.fk_user = users.user_id OR (users.use_custom_intervention_area IS FALSE AND intervention_areas.fk_organization = users.fk_organization)
        LEFT JOIN cities ON intervention_areas.fk_city = cities.code
        LEFT JOIN epci_to_departement ON intervention_areas.fk_epci = epci_to_departement.fk_epci
        WHERE users.fk_status = 'active' AND intervention_areas.is_main_area IS TRUE`,
        {
            type: QueryTypes.SELECT,
        },
    );

    return rows[0].total;
};
