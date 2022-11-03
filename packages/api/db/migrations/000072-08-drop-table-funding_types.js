module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP TABLE IF EXISTS "funding_types"',
            {
                transaction,
            },
        ),
    ),

    down: () => Promise.resolve(),

};
