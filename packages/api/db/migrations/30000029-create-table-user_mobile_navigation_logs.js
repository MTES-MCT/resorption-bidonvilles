module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.createTable(
            'user_mobile_navigation_logs',
            {
                user_navigation_log_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                fk_user: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                datetime: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                page: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
            },
            { transaction },
        );

        await queryInterface.addConstraint(
            'user_mobile_navigation_logs', {
                fields: ['fk_user'],
                type: 'foreign key',
                name: 'fk_user_mobile_navigation_logs_user_id',
                references: {
                    table: 'users',
                    field: 'user_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
                transaction,
            },
        );


        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.removeConstraint(
            'user_mobile_navigation_logs',
            'fk_user_mobile_navigation_logs_user_id',
            { transaction },
        );

        await queryInterface.dropTable('user_mobile_navigation_logs', { transaction });

        return transaction.commit();
    },
};
