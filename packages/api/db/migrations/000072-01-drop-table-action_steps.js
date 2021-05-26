module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP TABLE IF EXISTS action_steps',
            {
                transaction,
            },
        ),
    ),

    down: () => Promise.resolve(),

};
