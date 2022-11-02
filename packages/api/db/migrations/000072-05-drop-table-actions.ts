module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP TABLE IF EXISTS actions',
            {
                transaction,
            },
        ),
    ),

    down: () => Promise.resolve(),

};
