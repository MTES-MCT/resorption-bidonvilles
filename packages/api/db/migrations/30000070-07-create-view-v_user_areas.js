module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        `
        CREATE VIEW v_user_areas AS
        SELECT
            users.user_id,
            intervention_areas.is_main_area,
            COUNT(CASE intervention_areas.type WHEN 'nation' THEN 1 ELSE NULL END) > 0 AS is_national,
            array_remove(array_agg(COALESCE(intervention_areas.fk_region, d1.fk_region, d2.fk_region, d3.fk_region)), null) AS regions,
            array_remove(array_agg(COALESCE(intervention_areas.fk_departement, d1.code, d2.code)), null) AS departements,
            array_remove(array_agg(COALESCE(intervention_areas.fk_epci, e1.code)), null) AS epci,
            array_remove(array_agg(cities.code), null) AS cities
        FROM users
        LEFT JOIN intervention_areas ON users.user_id = intervention_areas.fk_user OR (users.use_custom_intervention_area IS FALSE AND users.fk_organization = intervention_areas.fk_organization)

        -- cas d'une ville
        LEFT JOIN cities ON intervention_areas.fk_city = cities.code
        LEFT JOIN epci e1 ON cities.fk_epci = e1.code
        LEFT JOIN departements d1 ON cities.fk_departement = d1.code

        -- cas d'un epci
        LEFT JOIN epci_to_departement e2 ON intervention_areas.fk_epci = e2.fk_epci
        LEFT JOIN departements d2 ON e2.fk_departement = d2.code

        -- cas d'un département
        LEFT JOIN departements d3 ON intervention_areas.fk_departement = d3.code

        GROUP BY users.user_id, intervention_areas.is_main_area`,
    ),

    down: queryInterface => queryInterface.sequelize.query(
        'DROP VIEW v_user_areas',
    ),
};
