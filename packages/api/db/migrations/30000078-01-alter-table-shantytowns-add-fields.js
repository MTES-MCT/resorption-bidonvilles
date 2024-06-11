function addColumnsTo(queryInterface, Sequelize, tableName, transaction) {
    return Promise.all([
        queryInterface.addColumn(
            tableName,
            'existing_litigation',
            {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            {
                transaction,
            },
        ),
        queryInterface.addColumn(
            tableName,
            'evacuation_under_time_limit',
            {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            {
                transaction,
            },
        ),
        queryInterface.addColumn(
            tableName,
            'administrative_order_decision_at',
            {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            {
                transaction,
            },
        ),
        queryInterface.addColumn(
            tableName,
            'administrative_order_decision_rendered_by',
            {
                type: Sequelize.STRING,
                allowNull: true,
            },
            {
                transaction,
            },
        ),
        queryInterface.addColumn(
            tableName,
            'administrative_order_evacuation_at',
            {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            {
                transaction,
            },
        ),
        queryInterface.addColumn(
            tableName,
            'insalubrity_order',
            {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            {
                transaction,
            },
        ),
        queryInterface.addColumn(
            tableName,
            'insalubrity_order_displayed',
            {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            {
                transaction,
            },
        ),
        queryInterface.addColumn(
            tableName,
            'insalubrity_order_type',
            {
                type: Sequelize.STRING,
                allowNull: true,
            },
            {
                transaction,
            },
        ),
        queryInterface.addColumn(
            tableName,
            'insalubrity_order_by',
            {
                type: Sequelize.STRING,
                allowNull: true,
            },
            {
                transaction,
            },
        ),
        queryInterface.addColumn(
            tableName,
            'insalubrity_order_at',
            {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            {
                transaction,
            },
        ),
        queryInterface.addColumn(
            tableName,
            'insalubrity_parcels',
            {
                type: Sequelize.STRING,
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
        queryInterface.removeColumn(tableName, 'insalubrity_parcels', { transaction }),
        queryInterface.removeColumn(tableName, 'insalubrity_order_at', { transaction }),
        queryInterface.removeColumn(tableName, 'insalubrity_order_by', { transaction }),
        queryInterface.removeColumn(tableName, 'insalubrity_order_type', { transaction }),
        queryInterface.removeColumn(tableName, 'insalubrity_order_displayed', { transaction }),
        queryInterface.removeColumn(tableName, 'insalubrity_order', { transaction }),
        queryInterface.removeColumn(tableName, 'administrative_order_evacuation_at', { transaction }),
        queryInterface.removeColumn(tableName, 'administrative_order_decision_rendered_by', { transaction }),
        queryInterface.removeColumn(tableName, 'administrative_order_decision_at', { transaction }),
        queryInterface.removeColumn(tableName, 'evacuation_under_time_limit', { transaction }),
        queryInterface.removeColumn(tableName, 'existing_litigation', { transaction }),
    ]);
}


module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await Promise.all([
                addColumnsTo(queryInterface, Sequelize, 'shantytowns', transaction),
                addColumnsTo(queryInterface, Sequelize, 'ShantytownHistories', transaction),
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
                removeColumnsFrom(queryInterface, 'shantytowns', transaction),
                removeColumnsFrom(queryInterface, 'ShantytownHistories', transaction),
            ]);

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
