module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'shantytown_comments',
        {
            shantytown_comment_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            fk_shantytown: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            created_by: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        },
    ).then(() => Promise.all([
        queryInterface.addConstraint('shantytown_comments', ['fk_shantytown'], {
            type: 'foreign key',
            name: 'fk_shantytown_comments_town',
            references: {
                table: 'shantytowns',
                field: 'shantytown_id',
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
        }),

        queryInterface.addConstraint('shantytown_comments', ['created_by'], {
            type: 'foreign key',
            name: 'fk_shantytown_comment_creator',
            references: {
                table: 'users',
                field: 'user_id',
            },
            onUpdate: 'cascade',
            onDelete: 'restrict',
        }),
    ])),

    down: queryInterface => queryInterface.dropTable('shantytown_comments'),
};
