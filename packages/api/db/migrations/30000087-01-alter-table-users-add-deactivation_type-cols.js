module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            const columns = [
                {
                    name: 'deactivation_type',
                    definition: {
                        type: Sequelize.STRING,
                        allowNull: true,
                        defaultValue: null,
                        authorizedValues: ['auto', 'admin', 'unknown', null],
                    },
                },
                {
                    name: 'anonymization_requested',
                    definition: {
                        type: Sequelize.BOOLEAN,
                        allowNull: true,
                        defaultValue: null,
                    },
                },
                {
                    name: 'anonymized_at',
                    definition: {
                        type: Sequelize.DATE(6),
                        allowNull: true,
                    },
                },
            ];

            // On ajoute toutes les colonnes dans la même transaction
            await Promise.all(
                columns.map(column => queryInterface.addColumn('users', column.name, column.definition, { transaction }),),
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await Promise.all([
                'deactivation_type',
                'anonymization_requested',
                'anonymized_at',
            ].map(columnName => queryInterface.removeColumn('users', columnName, { transaction }),));

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
