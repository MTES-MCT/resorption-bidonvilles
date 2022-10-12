module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'shantytown_comments',
            'private',
            {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'shantytown_comments',
            'private',
            {
                transaction,
            },
        ),
    ),

};
