const createLocalizedOrganizationsOnUp = require('./common/create_materialized_view_localized_organizations/add_being_funded_to_organizations_on_up');
const createLocalizedOrganizationsOnDown = require('./common/create_materialized_view_localized_organizations/add_being_funded_to_organizations_on_down');
const createViewShantytownWatchers = require('./common/shantytown_watchers/01_create_view_shantytown_watchers');

module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'organizations',
            'being_funded',
            {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            {
                transaction,
            },
        ).then(() => queryInterface.addColumn(
            'organizations',
            'being_funded_at',
            {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                transaction,
            },
        ).then(() => queryInterface.sequelize.query(
            'DROP VIEW IF EXISTS shantytown_watchers',
            {
                transaction,
            },
        )).then(() => queryInterface.sequelize.query(
            'DROP MATERIALIZED VIEW IF EXISTS localized_organizations',
            {
                transaction,
            },
        )).then(() => createLocalizedOrganizationsOnUp(queryInterface, transaction))
            .then(() => createViewShantytownWatchers(queryInterface, transaction))),
    ),

    down: queryInterface => Promise.all([
        queryInterface.sequelize.query('DROP VIEW IF EXISTS shantytown_watchers'),
        queryInterface.sequelize.query('DROP MATERIALIZED VIEW IF EXISTS localized_organizations'),
        createLocalizedOrganizationsOnDown(queryInterface),
    ]).then(() => createViewShantytownWatchers(queryInterface),
        queryInterface.removeColumn('organizations', 'being_funded'),
        queryInterface.removeColumn('organizations', 'being_funded_at')),
};
