function addColumnsTo(queryInterface, Sequelize, tableName, transaction) {
    return Promise.all([
        queryInterface.addColumn(
            tableName,
            'deactivation_type',
            {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null,
                authorizedValues: ['auto', 'admin', null],
            },
            {
                transaction,
            },
        ),
        queryInterface.addColumn(
            tableName,
            'anonymization_requested',
            {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: null,
            },
            {
                transaction,
            },
        ),
        queryInterface.addColumn(
            tableName,
            'anonymized_at',
            {
                type: Sequelize.DATE(6),
                allowNull: true,
            },
            {
                transaction,
            },
        ),
    ]);
}

function removeColumnsFrom(queryInterface, tableName, transaction) {
    return Promise.all([
        queryInterface.removeColumn(tableName, 'deactivation_type', { transaction }),
        queryInterface.removeColumn(tableName, 'anonymization_requested', { transaction }),
    ]);
}


module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await Promise.all([
                addColumnsTo(queryInterface, Sequelize, 'users', transaction),
            ]);
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
                removeColumnsFrom(queryInterface, 'users', transaction),
            ]);

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
