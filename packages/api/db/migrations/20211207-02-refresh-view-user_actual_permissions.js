const createNew = require('./common/user_actual_permissions/04_add_column_is_writing');
const createOld = require('./common/user_actual_permissions/03_create_view_without_organization');

module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP VIEW user_actual_permissions',
            {
                transaction,
            },
        )
            .then(() => createNew(queryInterface, transaction)),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP VIEW user_actual_permissions',
            {
                transaction,
            },
        )
            .then(() => createOld(queryInterface, transaction)),
    ),
};
