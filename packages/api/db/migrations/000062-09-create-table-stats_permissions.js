const createTable = require('./common/create_stats_permissions');

module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => createTable(queryInterface, Sequelize, transaction),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP TRIGGER stats_permission_check ON stats_permissions',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'DROP FUNCTION stats_permission_check()',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'stats_permissions',
                'fk_stats_permissions_permission',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable(
                'stats_permissions',
                {
                    transaction,
                },
            )),
    ),

};
