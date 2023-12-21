import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (departement: string): Promise<number> => {
    const rows: { count: number }[] = await sequelize.query(
        `
        SELECT COUNT(*) AS count
        FROM users
        LEFT JOIN intervention_areas ON intervention_areas.fk_user = users.user_id OR (users.use_custom_intervention_area IS FALSE AND intervention_areas.fk_organization = users.fk_organization)
        LEFT JOIN cities ON intervention_areas.fk_city = cities.code
        LEFT JOIN epci_to_departement ON intervention_areas.fk_epci = epci_to_departement.fk_epci
        WHERE users.fk_status = 'active' AND users.to_be_tracked IS TRUE AND intervention_areas.is_main_area IS TRUE
        ${departement ? 'AND COALESCE(intervention_areas.fk_departement, cities.fk_departement, epci_to_departement.fk_departement) = :departement' : ''}
        `,
        {
            type: QueryTypes.SELECT,
            replacements: {
                departement,
            },
        },
    );

    return rows[0].count;
};
