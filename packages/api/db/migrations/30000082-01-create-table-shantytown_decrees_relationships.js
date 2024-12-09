module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.createTable(
                'shantytown_decree_attachments',
                {
                    shantytown_decree_id: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                        autoIncrement: true,
                        primaryKey: true,
                    },
                    fk_shantytown: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    fk_attachment: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    attachment_type: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                },
                { transaction },
            );
            await Promise.all([
            // clés étrangères
                queryInterface.addConstraint('shantytown_decree_attachments', {
                    fields: ['fk_shantytown'],
                    type: 'foreign key',
                    name: 'fk_decree__shantytown',
                    references: {
                        table: 'shantytowns',
                        field: 'shantytown_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
                queryInterface.addConstraint('shantytown_decree_attachments', {
                    fields: ['fk_attachment'],
                    type: 'foreign key',
                    name: 'fk_decree__attachment',
                    references: {
                        table: 'attachments',
                        field: 'attachment_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
            ]);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: queryInterface => queryInterface.dropTable('shantytown_decree_attachments'),
};
