module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        await queryInterface.removeConstraint(
            'user_navigation_logs',
            'fk_user_navigation_logs_user_id',
            { transaction },
        );

        await queryInterface.renameTable('user_navigation_logs', 'user_webapp_navigation_logs', { transaction });

        await queryInterface.addConstraint(
            'user_webapp_navigation_logs', {
                fields: ['fk_user'],
                type: 'foreign key',
                name: 'fk_user_webapp_navigation_logs_user_id',
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
            'user_webapp_navigation_logs',
            'fk_user_webapp_navigation_logs_user_id',
            { transaction },
        );

        await queryInterface.renameTable('user_webapp_navigation_logs', 'user_navigation_logs', { transaction });

        await queryInterface.addConstraint(
            'user_navigation_logs', {
                fields: ['fk_user'],
                type: 'foreign key',
                name: 'fk_user_navigation_logs_user_id',
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
};
