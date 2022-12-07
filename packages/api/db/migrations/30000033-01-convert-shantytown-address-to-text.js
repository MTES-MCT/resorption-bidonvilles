module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.changeColumn('ShantytownHistories', 'address_details', {
        type: Sequelize.TEXT,
        allowNull: true,
    }),

    down: (queryInterface, Sequelize) => queryInterface.changeColumn('ShantytownHistories', 'address_details', {
        type: Sequelize.STRING,
        allowNull: true,
    }),
};
