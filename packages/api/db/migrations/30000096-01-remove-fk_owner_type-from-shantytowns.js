module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.removeColumn(
                'shantytowns',
                'fk_owner_type',
                { transaction },
            );

            await queryInterface.removeColumn(
                'ShantytownHistories',
                'fk_owner_type',
                { transaction },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.addColumn(
                'shantytowns',
                'fk_owner_type',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'owner_types',
                        key: 'owner_type_id',
                    },
                },
                { transaction },
            );

            await queryInterface.addColumn(
                'ShantytownHistories',
                'fk_owner_type',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'owner_types',
                        key: 'owner_type_id',
                    },
                },
                { transaction },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
