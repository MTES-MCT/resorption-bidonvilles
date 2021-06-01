module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'closing_solutions',
        {
            closing_solution_id: {
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
        .then(() => queryInterface.addConstraint('closing_solutions', ['label'], {
            type: 'unique',
            name: 'uk_closing_solutions_label',
        }))
        .then(() => queryInterface.bulkInsert(
            'closing_solutions',
            [
                { label: 'Mise à l’abri / hébergement d’urgence (CHU)' },
                { label: 'Hébergement d’insertion (CHRS, ALT)' },
                { label: 'Logement ordinaire ou adapté (résidences sociales, IML, pensions de famille, logements social ou privé accompagnés)' },
                { label: 'Dispositif dédié (CADA, HUDA, CAO, CHUM, ARV, ...)' },
                { label: 'Dispositif spécifique d’insertion au territoire' },
                { label: 'Dispositifs de veille sociale ou sans solution' },
            ],
        )),

    down: queryInterface => queryInterface.dropTable('closing_solutions'),
};
