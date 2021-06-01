module.exports = {

    up: (queryInterface, Sequelize) => Promise.all([
        queryInterface.addColumn('plans', 'targeted_on_towns', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        }),
    ]),

    down: queryInterface => Promise.all([
        queryInterface.removeColumn('plans', 'targeted_on_towns'),
    ]),

};
