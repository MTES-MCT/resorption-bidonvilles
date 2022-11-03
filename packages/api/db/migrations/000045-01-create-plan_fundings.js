module.exports = {

    up: (queryInterface, Sequelize) => Promise.all([
        queryInterface.createTable(
            'plan_fundings',
            {
                plan_funding_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                year: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                amount: {
                    type: Sequelize.DOUBLE,
                    allowNull: false,
                },
                details: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                fk_plan: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                fk_type: {
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
    ]),

    down: queryInterface => queryInterface.dropTable('plan_fundings'),

};
