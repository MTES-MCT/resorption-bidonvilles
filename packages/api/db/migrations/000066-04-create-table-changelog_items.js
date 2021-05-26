module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'changelog_items',
            {
                changelog_item_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                title: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                image: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                position: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                fk_changelog: {
                    type: Sequelize.STRING,
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
                'changelog_items',
                ['fk_changelog', 'position'],
                {
                    type: 'unique',
                    name: 'uk_position',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'changelog_items',
                ['fk_changelog'],
                {
                    type: 'foreign key',
                    name: 'fk_changelog_items_changelog',
                    references: {
                        table: 'changelogs',
                        field: 'app_version',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'changelog_items',
            'uk_position',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'changelog_items',
                'fk_changelog_items_changelog',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('changelog_items', { transaction })),
    ),

};
