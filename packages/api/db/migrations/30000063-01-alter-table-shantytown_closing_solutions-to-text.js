module.exports = {

    up(queryInterface, Sequelize) {
        return queryInterface.changeColumn('shantytown_closing_solutions', 'message', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    },

    down(queryInterface, Sequelize) {
        return queryInterface.changeColumn('shantytown_closing_solutions', 'message', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },
};
