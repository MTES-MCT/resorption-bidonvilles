const createViewActualPermissions = require('./common/create_view_user_actual_permissions');

module.exports = {
    up: queryInterface => createViewActualPermissions(queryInterface),
    down: queryInterface => queryInterface.sequelize.query(
        'DROP VIEW user_actual_permissions',
    ),
};
