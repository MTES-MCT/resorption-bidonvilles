const createTable = require('./common/create_shantytown_comment_permissions');

module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => createTable(queryInterface, Sequelize, transaction),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP TRIGGER shantytown_comment_permission_check ON shantytown_comment_permissions',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'DROP FUNCTION shantytown_comment_permission_check()',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'shantytown_comment_permissions',
                'fk_shantytown_comment_permissions_permission',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable(
                'shantytown_comment_permissions',
                {
                    transaction,
                },
            )),
    ),

};
