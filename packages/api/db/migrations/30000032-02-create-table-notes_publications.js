module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        await queryInterface.createTable(
            'notes_publications',
            {
                fk_note: {
                    type: Sequelize.STRING,
                    primaryKey: true,
                    allowNull: false,
                },
                fk_shantytown: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
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

        await Promise.all([
            queryInterface.addConstraint(
                'notes_publications', {
                fields: ['fk_note'],
                type: 'foreign key',
                name: 'fk_notes_publications__note_id',
                references: {
                    table: 'notes',
                    field: 'note_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
                transaction,
            },
            ),
            queryInterface.addConstraint(
                'notes_publications', {
                fields: ['fk_shantytown'],
                type: 'foreign key',
                name: 'fk_notes_publications__shantytown_id',
                references: {
                    table: 'shantytowns',
                    field: 'shantytown_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
                transaction,
            },
            ),
        ]);

        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        await Promise.all([
            queryInterface.removeConstraint(
                'notes_publications',
                'fk_notes_publications__shantytown_id',
                { transaction },
            ),
            queryInterface.removeConstraint(
                'notes_publications',
                'fk_notes_publications__note_id',
                { transaction },
            ),
        ]);
        await queryInterface.dropTable('notes_publications', { transaction });
        return transaction.commit();
    },
};