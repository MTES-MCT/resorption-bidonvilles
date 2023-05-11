const tables = [
    'shantytown_comment',
    'action_comment',
    'question',
    'answer',
];

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all(
                tables.map(table => queryInterface.createTable(
                    `${table}_attachments`,
                    {
                        [`fk_${table}`]: {
                            type: Sequelize.INTEGER,
                            allowNull: false,
                            primaryKey: true,
                        },
                        fk_attachment: {
                            type: Sequelize.INTEGER,
                            allowNull: false,
                            primaryKey: true,
                        },
                    },
                    { transaction },
                )),
            );

            await Promise.all(
                tables.map(table => [
                    queryInterface.addConstraint(`${table}_attachments`, {
                        fields: [`fk_${table}`],
                        type: 'foreign key',
                        name: `fk_${table}`,
                        references: {
                            table: `${table}s`,
                            field: `${table}_id`,
                        },
                        onUpdate: 'cascade',
                        onDelete: 'restrict',
                        transaction,
                    }),
                    queryInterface.addConstraint(`${table}_attachments`, {
                        fields: ['fk_attachment'],
                        type: 'foreign key',
                        name: 'fk_attachment',
                        references: {
                            table: 'attachments',
                            field: 'attachment_id',
                        },
                        onUpdate: 'cascade',
                        onDelete: 'cascade',
                        transaction,
                    }),
                ]).flat(),
            );

            return transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all(
                tables.map(table => [
                    queryInterface.removeConstraint(`${table}_attachments`, `fk_${table}`, { transaction }),
                    queryInterface.removeConstraint(`${table}_attachments`, 'fk_attachment', { transaction }),
                ]).flat(),
            );

            await Promise.all(
                tables.map(table => queryInterface.dropTable(`${table}_attachments`, { transaction })),
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
