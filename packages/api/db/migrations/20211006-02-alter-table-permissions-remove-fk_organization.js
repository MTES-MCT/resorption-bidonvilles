const createViewWithAppliedOptions = require('./common/user_actual_permissions/02_create_view_with_applied_options');
const createViewWithoutOrganization = require('./common/user_actual_permissions/03_create_view_without_organization');

module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP VIEW user_actual_permissions',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'permissions',
                'fk_permisions_organization',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeColumn(
                'permissions',
                'fk_organization',
                {
                    transaction,
                },
            ))
            .then(() => createViewWithoutOrganization(queryInterface, transaction)),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP VIEW user_actual_permissions',
            {
                transaction,
            },
        )
            .then(() => queryInterface.addColumn(
                'permissions',
                'fk_organization',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ))
            // we don't need to populate fk_organization here because the previous migration removes all rows where fk_organization is not null
            .then(() => queryInterface.addConstraint(
                'permissions',
                ['fk_organization'],
                {
                    type: 'foreign key',
                    name: 'fk_permisions_organization',
                    references: {
                        table: 'organizations',
                        field: 'organization_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ))
            .then(() => createViewWithAppliedOptions(queryInterface, transaction)),
    ),

};
