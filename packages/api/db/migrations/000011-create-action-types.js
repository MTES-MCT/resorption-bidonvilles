module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'action_types',
        {
            action_type_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            label: {
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
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        },
    ).then(() => queryInterface.addConstraint('action_types', ['label'], {
        type: 'unique',
        name: 'uk_action_types_label',
    })),

    down: queryInterface => queryInterface.dropTable('action_types'),
};
