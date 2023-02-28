const createNewView = require('./common/user_permissions_with_attachments/02_remove-is_cumulative');

module.exports = {
    up: queryInterface => queryInterface.sequelize.query(createNewView),

    down: queryInterface => queryInterface.sequelize.query('DROP VIEW user_permissions_with_attachments'),
};
