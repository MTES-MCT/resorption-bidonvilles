module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'plan_types',
        {
            plan_type_id: {
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
    )
        .then(() => queryInterface.bulkInsert(
            'plan_types',
            [
                { label: 'Espace temporaire d’insertion' },
                { label: 'Accompagnement social global' },
                { label: 'Intervention sanitaire' },
                { label: 'Accompagnement scolaire' },
                { label: 'Protection de l’enfance' },
                { label: 'Accompagnement emploi' },
            ],
        )),

    down: queryInterface => queryInterface.dropTable('plan_types'),

};
