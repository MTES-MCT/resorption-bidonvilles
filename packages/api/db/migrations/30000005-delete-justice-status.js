
module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.removeColumn('ShantytownHistories', 'justice_status', {
                transaction,
            }),
            queryInterface.sequelize.query('DROP TYPE "enum_ShantytownHistories_justice_status" CASCADE', {
                transaction,
            }),
        ]),
    ),


    down: (queryInterface, Sequelize) => Promise.all([

        queryInterface.addColumn(
            'ShantytownHistories',
            'justice_status',
            {
                type: Sequelize.ENUM('none', 'seized', 'rendered'),
                allowNull: true,
            },
        ),
    ]),
};
