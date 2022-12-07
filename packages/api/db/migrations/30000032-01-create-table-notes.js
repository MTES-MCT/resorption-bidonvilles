module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        // on crée la table
        transaction => queryInterface.createTable(
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
                    defaultValue: 'onglet_notes',
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
        )

            // on crée la contrainte
            .then(() => queryInterface.addConstraint(
                'notes', {
                fields: ['created_by'],
                type: 'foreign key',
                name: 'fk_notes__created_by',
                references: {
                    table: 'users',
                    field: 'user_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
                transaction,
            },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        // on supprime la contrainte
        transaction => queryInterface.removeConstraint(
            'notes',
            'fk_notes__created_by',
            { transaction },
        )

            // on supprime la table
            .then(() => queryInterface.dropTable('notes', { transaction })),
    ),
};    