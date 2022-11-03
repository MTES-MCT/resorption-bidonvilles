module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'users',
            'last_activation_link_sent_on',
            {
                type: Sequelize.DATE,
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
            'last_activation_link_sent_on',
            { transaction },
        ),
    ),

};
