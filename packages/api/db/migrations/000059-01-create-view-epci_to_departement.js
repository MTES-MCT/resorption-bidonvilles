module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `CREATE VIEW epci_to_departement AS
            (
                SELECT
                    DISTINCT ON (fk_epci)
                    fk_epci,
                    fk_departement
                FROM
                    cities
                ORDER BY fk_epci
            )`,
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.sequelize.query('DROP VIEW epci_to_departement'),

};
