module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        `
        INSERT INTO intervention_areas(fk_organization, is_main_area, type, fk_region, fk_departement, fk_epci, fk_city)
        SELECT
            organization_id,
            TRUE,
            (CASE
                WHEN fk_region IS NOT NULL THEN 'region'
                WHEN fk_departement IS NOT NULL THEN 'departement'
                WHEN fk_epci IS NOT NULL THEN 'epci'
                WHEN fk_city IS NOT NULL THEN 'city'
                ELSE 'nation'
            END)::enum_intervention_areas_type,
            fk_region,
            fk_departement,
            fk_epci,
            fk_city
        FROM organizations`,
    ),

    down: queryInterface => queryInterface.sequelize.query(
        'DELETE FROM intervention_areas',
    ),
};
