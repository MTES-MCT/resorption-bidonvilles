module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'users',
            'access_request_message',
            {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'users',
            'access_request_message',
            { transaction },
        ),
    ),

};
