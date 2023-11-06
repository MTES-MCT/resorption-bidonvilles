module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        // on ajoute la colonne
        try {
            await queryInterface.addColumn(
                'organizations',
                'grant_national_access',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                { transaction },
            );

            await queryInterface.sequelize.query(
                'UPDATE organizations SET grant_national_access = TRUE WHERE fk_region IS NULL AND fk_departement IS NULL AND fk_epci IS NULL AND fk_city IS NULL',
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: queryInterface => queryInterface.removeColumn('organizations', 'grant_national_access'),

};
