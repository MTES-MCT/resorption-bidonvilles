module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'stats_directory_views',
            {
                organization: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                viewed_by: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: null,
                    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addConstraint(
                'stats_directory_views',
                ['organization'],
                {
                    type: 'foreign key',
                    name: 'fk_statsDirectoryViews_organization',
                    references: {
                        table: 'organizations',
                        field: 'organization_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'stats_directory_views',
                ['viewed_by'],
                {
                    type: 'foreign key',
                    name: 'fk_statsDirectoryViews_viewedBy',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'stats_directory_views',
            'fk_statsDirectoryViews_organization',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'stats_directory_views',
                'fk_statsDirectoryViews_viewedBy',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('stats_directory_views', { transaction })),
    ),

};
