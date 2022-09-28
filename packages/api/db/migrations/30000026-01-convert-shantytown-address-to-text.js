module.exports = {
    // up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
    //     await queryInterface.changeColumn('shantytowns', 'address_details',
    //         {
    //             type: Sequelize.TEXT,
    //             allowNull: true,
    //         }, { transaction });
    // }),

    up: (queryInterface, Sequelize) => Promise.all([
        queryInterface.changeColumn('shantytowns', 'address_details', {
            type: Sequelize.TEXT,
            allowNull: true,
        }),
    ]),

    // down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
    //     await queryInterface.changeColumn('shantytowns', 'address_details',
    //         {
    //             type: Sequelize.STRING,
    //             allowNull: true,
    //         }, { transaction });
    // }),

    down: (queryInterface, Sequelize) => Promise.all([
        queryInterface.changeColumn('shantytowns', 'address_details', {
            type: Sequelize.STRING,
            allowNull: true,
        }),
    ]),
};
