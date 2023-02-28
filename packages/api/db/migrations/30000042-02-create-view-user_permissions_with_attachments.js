const createView = require('./common/user_permissions_with_attachments/01_initial_view');

module.exports = {
    up: queryInterface => queryInterface.sequelize.query(createView),

    down: queryInterface => queryInterface.sequelize.query(
        'DROP VIEW user_permissions_with_attachments',
    ),
};
