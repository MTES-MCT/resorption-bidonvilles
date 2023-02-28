const createView = require('./common/user_actual_permissions/10_reset');

module.exports = {
    up: queryInterface => queryInterface.sequelize.query(createView),

    down: queryInterface => queryInterface.sequelize.query('DROP VIEW user_actual_permissions'),
};
