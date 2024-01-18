const createLocalizedOrganizationNewSchema = require('./common/localized_organizations/02_add_being_funded_columns');

module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        'DROP MATERIALIZED VIEW IF EXISTS localized_organizations',
    ),

    down: queryInterface => createLocalizedOrganizationNewSchema(queryInterface),
};
