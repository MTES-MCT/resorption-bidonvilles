const createTable = require('./common/create_shantytown_permissions');

module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => createTable(queryInterface, Sequelize, transaction),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP TRIGGER shantytown_permission_check ON shantytown_permissions',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'DROP FUNCTION shantytown_permission_check()',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'shantytown_permissions',
                'fk_shantytown_permissions_permission',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable(
                'shantytown_permissions',
                {
                    transaction,
                },
            )),
    ),

};
