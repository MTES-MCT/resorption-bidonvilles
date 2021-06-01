module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP TABLE IF EXISTS action_types',
            {
                transaction,
            },
        ),
    ),

    down: () => Promise.resolve(),

};
