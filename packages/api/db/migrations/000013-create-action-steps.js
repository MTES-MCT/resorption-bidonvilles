module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'action_steps',
        {
            action_step_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
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
    ).then(() => queryInterface.addConstraint('action_steps', ['fk_action'], {
        type: 'foreign key',
        name: 'fk_action_steps_action',
        references: {
            table: 'actions',
            field: 'action_id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
    })),

    down: queryInterface => queryInterface.dropTable('action_steps'),
};
