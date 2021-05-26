module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'field_types',
        {
            field_type_id: {
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
        .then(() => queryInterface.addConstraint('field_types', ['label'], {
            type: 'unique',
            name: 'uk_field_types_label',
        }))
        .then(() => queryInterface.bulkInsert(
            'field_types',
            [
                { label: 'Inconnu' },
                { label: 'Terrain' },
                { label: 'Immeuble bâti' },
            ],
        )),

    down: queryInterface => queryInterface.dropTable('field_types'),
};
