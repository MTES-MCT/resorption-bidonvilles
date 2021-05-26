module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'ActionStepHistories',
        {
            // temporal columns
            hid: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            archivedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            // original action columns
            action_step_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
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
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        },
    )
        .then(() => queryInterface.addConstraint('ActionStepHistories', ['fk_action'], {
            type: 'foreign key',
            name: 'fk_action_steps_action',
            references: {
                table: 'actions',
                field: 'action_id',
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
        })),

    down: queryInterface => queryInterface.dropTable('ActionStepHistories'),
};
