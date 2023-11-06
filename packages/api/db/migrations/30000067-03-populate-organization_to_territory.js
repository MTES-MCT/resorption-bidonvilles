module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        'INSERT INTO organization_to_territory(fk_organization, fk_region, fk_departement, fk_epci, fk_city) SELECT organization_id, fk_region, fk_departement, fk_epci, fk_city FROM organizations WHERE grant_national_access IS FALSE',
    ),

    down: queryInterface => queryInterface.sequelize.query(
        'DELETE FROM organization_to_territory',
    ),
};
