module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // Ajout de la colonne updated_by
            await queryInterface.addColumn(
                'shantytown_comments',
                'updated_by',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                { transaction },
            );

            // Ajout de la contrainte de clé étrangère
            await queryInterface.addConstraint('shantytown_comments', {
                fields: ['updated_by'],
                type: 'foreign key',
                name: 'fk_shantytown_comment_editor',
                references: {
                    table: 'users',
                    field: 'user_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
                transaction,
            });

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.removeConstraint(
                'shantytown_comments',
                'fk_shantytown_comment_editor',
                { transaction },
            );

            await queryInterface.removeColumn(
                'shantytown_comments',
                'updated_by',
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
