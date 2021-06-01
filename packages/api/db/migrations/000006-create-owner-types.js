module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'owner_types',
        {
            owner_type_id: {
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
        .then(() => queryInterface.addConstraint('owner_types', ['label'], {
            type: 'unique',
            name: 'uk_owner_types_label',
        }))
        .then(() => queryInterface.bulkInsert(
            'owner_types',
            [
                { label: 'Inconnu' },
                { label: 'Public' },
                { label: 'Privé' },
            ],
        )),

    down: queryInterface => queryInterface.dropTable('owner_types'),
};
