const createView = require('./common/full_user_permissions_by_role/01_initial_view');

module.exports = {
    up: queryInterface => queryInterface.sequelize.query(createView),

    down: queryInterface => queryInterface.sequelize.query('DROP VIEW full_user_permissions_by_role'),
};
