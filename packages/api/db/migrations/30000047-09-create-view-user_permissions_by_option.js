const createView = require('./common/user_permissions_by_option/03_reset');

module.exports = {
    up: queryInterface => queryInterface.sequelize.query(createView),

    down: queryInterface => queryInterface.sequelize.query('DROP VIEW user_permissions_by_option'),
};
