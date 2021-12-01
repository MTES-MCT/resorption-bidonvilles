const createLocalizedOrganizationOriginalSchema = require('./common/localized_organizations/01_create_original_view');
const createLocalizedOrganizationNewSchema = require('./common/localized_organizations/02_add_being_funded_columns');
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
        )).then(() => queryInterface.sequelize.query(
            'DROP VIEW IF EXISTS shantytown_watchers',
            {
                transaction,
            },
        )).then(() => queryInterface.sequelize.query(
            'DROP MATERIALIZED VIEW IF EXISTS localized_organizations',
            {
                transaction,
            },
        ))
            .then(() => createLocalizedOrganizationNewSchema(queryInterface, transaction))
            .then(() => createViewShantytownWatchers(queryInterface, transaction)),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP VIEW IF EXISTS shantytown_watchers',
            {
                transaction,
            },
        ).then(() => queryInterface.sequelize.query(
            'DROP MATERIALIZED VIEW IF EXISTS localized_organizations',
            {
                transaction,
            },
        ))
            .then(() => createLocalizedOrganizationOriginalSchema(queryInterface, transaction))
            .then(() => createViewShantytownWatchers(queryInterface, transaction))
            .then(() => Promise.all([
                queryInterface.removeColumn('organizations', 'being_funded', { transaction }),
                queryInterface.removeColumn('organizations', 'being_funded_at', { transaction }),
            ])),
    ),
};
