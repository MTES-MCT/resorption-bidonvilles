module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
        queryInterface.changeColumn('shantytowns', 'address_details', {
            type: Sequelize.TEXT,
            allowNull: true,
        }),
    ]),

    down: (queryInterface, Sequelize) => Promise.all([
        queryInterface.changeColumn('shantytowns', 'address_details', {
            type: Sequelize.STRING,
            allowNull: true,
        }),
    ]),
};
