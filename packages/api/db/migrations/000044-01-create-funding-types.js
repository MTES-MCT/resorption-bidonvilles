module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'funding_types',
        {
            funding_type_id: {
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
            'funding_types',
            [
                { label: 'Financements étatiques hors crédits dédiés' },
                { label: 'Crédits dédiés à la résorption des bidonvilles' },
                { label: 'Cofinancement collectivité territoriale' },
                { label: 'Financement européen' },
                { label: 'Financement privé' },
                { label: 'Autre' },
            ],
        )),

    down: queryInterface => queryInterface.dropTable('funding_types'),

};
