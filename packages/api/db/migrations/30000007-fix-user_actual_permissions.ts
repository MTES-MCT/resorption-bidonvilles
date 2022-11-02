const createNew = require('./common/user_actual_permissions/07_fix_access_justice_option');
const createOld = require('./common/user_actual_permissions/06_support_attachments');

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
