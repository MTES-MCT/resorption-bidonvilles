module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
        queryInterface.addColumn(
            'users',
            'first_name',
            {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'inconnu',
            },
        ),
        queryInterface.addColumn(
            'users',
            'last_name',
            {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'inconnu',
            },
        ),
        queryInterface.addColumn(
            'users',
            'company',
            {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'inconnu',
            },
        ),
    ]).then(() => Promise.all([
        queryInterface.changeColumn(
            'users',
            'first_name',
            {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: null,
            },
        ),
        queryInterface.changeColumn(
            'users',
            'last_name',
            {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: null,
            },
        ),
        queryInterface.changeColumn(
            'users',
            'company',
            {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: null,
            },
        ),
    ])),

    down: queryInterface => Promise.all([
        queryInterface.removeColumn('users', 'first_name'),
        queryInterface.removeColumn('users', 'last_name'),
        queryInterface.removeColumn('users', 'company'),
    ]),

};
