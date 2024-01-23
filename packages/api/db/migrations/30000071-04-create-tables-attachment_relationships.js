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
                queryInterface.sequelize.query(
                    `CREATE OR REPLACE FUNCTION delete_related_attachment() RETURNS TRIGGER AS $$
                    BEGIN
                        DELETE FROM attachments WHERE attachment_id = OLD.fk_attachment;
                        RETURN OLD;
                    END;
                    $$ LANGUAGE plpgsql`,
                    { transaction },
                ),
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
                        onDelete: 'cascade',
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
                    queryInterface.sequelize.query(
                        `CREATE TRIGGER delete_actual_attachment AFTER DELETE ON ${table}_attachments
                            FOR EACH ROW EXECUTE PROCEDURE delete_related_attachment()`,
                        {
                            transaction,
                        },
                    ),
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
                    queryInterface.sequelize.query(`DROP TRIGGER delete_actual_attachment ON ${table}_attachments`, { transaction }),
                ]).flat(),
            );

            await Promise.all([
                ...tables.map(table => queryInterface.dropTable(`${table}_attachments`, { transaction })),
                queryInterface.sequelize.query('DROP FUNCTION delete_related_attachment()', { transaction }),
            ]);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
