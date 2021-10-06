const createViewActualPermissions = require('./common/user_actual_permissions/01_create_original_view');

module.exports = {
    up: queryInterface => createViewActualPermissions(queryInterface),
    down: queryInterface => queryInterface.sequelize.query(
        'DROP VIEW user_actual_permissions',
    ),
};
