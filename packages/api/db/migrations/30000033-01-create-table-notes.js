module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        // on crée la table
        await queryInterface.createTable(
            'notes',
            {
                note_id: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true,
                },
                created_from: {
                    type: Sequelize.ENUM('onglet_notes', 'journal_de_site'),
                    allowNull: false,
                },
                number_of_copies: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    default: 0,
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

        // on crée la contrainte
        await queryInterface.addConstraint(
            'notes',
            {
                fields: ['created_by'],
                type: 'foreign key',
                name: 'fk_notes_created_by',
                references: {
                    table: 'users',
                    field: 'user_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            },
        );

        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        // on supprime la contrainte
        await queryInterface.removeConstraint(
            'notes',
            'fk_notes_created_by',
            { transaction },
        );

        // on supprime la table
        await queryInterface.dropTable('notes', { transaction });

        return transaction.commit();
    },
};
