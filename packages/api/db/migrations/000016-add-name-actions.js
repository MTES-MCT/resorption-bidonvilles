module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
        queryInterface.addColumn(
            'actions',
            'name',
            {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'Inconnu',
            },
        ),
    ]).then(() => queryInterface.changeColumn(
        'actions',
        'name',
        {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: null,
        },
    )),

    down: queryInterface => Promise.all([
        queryInterface.removeColumn('actions', 'name'),
    ]),
};
