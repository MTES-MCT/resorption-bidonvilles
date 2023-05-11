module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.createTable(
                'attachments',
                {
                    attachment_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                        autoIncrement: true,
                    },
                    url_original: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    url_preview: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    original_name: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    created_by: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                },
                { transaction },
            );

            await queryInterface.addConstraint('attachments', {
                fields: ['created_by'],
                type: 'foreign key',
                name: 'fk_attachment_creator',
                references: {
                    table: 'users',
                    field: 'user_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
                transaction,
            });

            return transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.removeConstraint(
                'attachments',
                'fk_attachment_creator',
                { transaction },
            );

            await queryInterface.dropTable('attachments', { transaction });

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
