module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'shantytown_steps',
        {
            shantytown_step_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            fk_shantytown: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            fk_action: {
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
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        },
    ).then(() => Promise.all([
        queryInterface.addConstraint('shantytown_steps', ['fk_action'], {
            type: 'foreign key',
            name: 'fk_shantytown_steps_action',
            references: {
                table: 'actions',
                field: 'action_id',
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
        }),
        queryInterface.addConstraint('shantytown_steps', ['fk_shantytown'], {
            type: 'foreign key',
            name: 'fk_shantytown_steps_shantytown',
            references: {
                table: 'shantytowns',
                field: 'shantytown_id',
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
        }),
    ])),

    down: queryInterface => queryInterface.dropTable('shantytown_steps'),
};
