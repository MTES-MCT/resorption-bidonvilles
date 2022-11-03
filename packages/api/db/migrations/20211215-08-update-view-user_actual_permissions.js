const createOld = require('./common/user_actual_permissions/05_fix_geographic_level_for_hide_justice');
const createNew = require('./common/user_actual_permissions/06_support_attachments');

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
