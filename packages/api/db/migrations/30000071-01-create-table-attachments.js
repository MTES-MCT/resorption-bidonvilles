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
                    original_file_key: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    preview_file_key: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    original_name: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    mimetype: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    size: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    created_by: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    created_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
                onDelete: 'cascade',
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
