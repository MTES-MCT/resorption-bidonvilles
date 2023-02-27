const view = require('./common/user_permissions_by_option/01_original_view');

module.exports = {
    up: queryInterface => queryInterface.sequelize.query(view),

    down: queryInterface => queryInterface.sequelize.query(
        'DROP VIEW user_permissions_by_option',
    ),
};
