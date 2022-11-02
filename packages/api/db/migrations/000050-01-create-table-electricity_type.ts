module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'electricity_types',
        {
            electricity_type_id: {
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
            'electricity_types',
            [
                { label: 'Inconnu' },
                { label: 'Non' },
                { label: 'Oui' },
                { label: 'Oui (accès régulier)' },
                { label: 'Oui (accès irrégulier)' },
            ],
        )),

    down: queryInterface => queryInterface.dropTable('electricity_types'),

};
