

module.exports = {
    async up(queryInterface, Sequelize) {         
        await queryInterface.addColumn(
            'users',
            'to_be_tracked',
            {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,

            },
        );
    },

    async down(queryInterface) {
        queryInterface.removeColumn(
            'users',
            'to_be_tracked',
        );
    },
};
