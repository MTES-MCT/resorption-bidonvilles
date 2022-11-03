const createTable = require('./common/create_user_permissions');

module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => createTable(queryInterface, Sequelize, transaction),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP TRIGGER user_permission_check ON user_permissions',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'DROP FUNCTION user_permission_check()',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'user_permissions',
                'fk_user_permissions_permission',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable(
                'user_permissions',
                {
                    transaction,
                },
            )),
    ),

};
