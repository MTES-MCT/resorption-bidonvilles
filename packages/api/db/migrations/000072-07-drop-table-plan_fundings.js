module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP TABLE IF EXISTS "plan_fundings"',
            {
                transaction,
            },
        ),
    ),

    down: () => Promise.resolve(),

};
