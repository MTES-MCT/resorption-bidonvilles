const createView = require('./common/full_role_permissions/01_initial_view');

module.exports = {
    up: queryInterface => queryInterface.sequelize.query(createView),

    down: queryInterface => queryInterface.sequelize.query('DROP VIEW full_role_permissions'),
};
