module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'high_covid_comments',
            {
                high_covid_comment_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                created_by: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated_by: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: null,
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
                'high_covid_comments',
                ['created_by'],
                {
                    type: 'foreign key',
                    name: 'fk_high_covid_comments_creator',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'high_covid_comments',
                ['updated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_high_covid_comments_editor',
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
            'high_covid_comments',
            'fk_high_covid_comments_creator',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'high_covid_comments',
                'fk_high_covid_comments_editor',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('high_covid_comments', { transaction })),
    ),

};
