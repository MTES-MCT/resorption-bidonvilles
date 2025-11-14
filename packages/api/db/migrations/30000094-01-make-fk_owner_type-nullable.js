module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // Supprimer les contraintes de clé étrangère sur fk_owner_type
            await queryInterface.removeConstraint(
                'shantytowns',
                'fk_shantytowns_owner_type',
                { transaction },
            );

            // Rendre fk_owner_type nullable dans les deux tables
            await queryInterface.changeColumn(
                'shantytowns',
                'fk_owner_type',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                { transaction },
            );

            // Recréer la contrainte de clé étrangère avec set null
            await queryInterface.addConstraint('shantytowns', {
                fields: ['fk_owner_type'],
                type: 'foreign key',
                name: 'fk_shantytowns_owner_type',
                references: {
                    table: 'owner_types',
                    field: 'owner_type_id',
                },
                onUpdate: 'cascade',
                onDelete: 'set null',
                transaction,
            });

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // Supprimer la contrainte de clé étrangère
            await queryInterface.removeConstraint(
                'shantytowns',
                'fk_shantytowns_owner_type',
                { transaction },
            );

            // Rendre fk_owner_type non nullable
            await queryInterface.changeColumn(
                'shantytowns',
                'fk_owner_type',
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                { transaction },
            );

            // Recréer la contrainte de clé étrangère avec restrict
            await queryInterface.addConstraint('shantytowns', {
                fields: ['fk_owner_type'],
                type: 'foreign key',
                name: 'fk_shantytowns_owner_type',
                references: {
                    table: 'owner_types',
                    field: 'owner_type_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
                transaction,
            });

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
};
