module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'plan_shantytowns',
        {
            plan_shantytown_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            fk_plan: {
                type: Sequelize.INTEGER,
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
            updated_by: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
    ),

    down: queryInterface => queryInterface.dropTable('plan_shantytowns'),

};
