module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `
            CREATE VIEW roles AS
            (SELECT *, 'regular' AS type FROM roles_regular)
                UNION
            (SELECT *, 'admin' AS type FROM roles_admin)`,
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.sequelize.query('DROP VIEW roles'),

};
