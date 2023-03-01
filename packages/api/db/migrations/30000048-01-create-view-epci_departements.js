module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        `CREATE OR REPLACE VIEW epci_departements AS
        SELECT
            fk_epci,
            array_agg(DISTINCT fk_departement) AS departements
        FROM cities
        GROUP BY fk_epci`,
    ),

    down: queryInterface => queryInterface.sequelize.query('DROP VIEW epci_departements'),
};
