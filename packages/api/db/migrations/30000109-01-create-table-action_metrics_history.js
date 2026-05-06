// Historisation des métriques d'actions
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        // Helper pour créer une colonne INTEGER nullable (évite la duplication)
        const nullableInteger = () => ({
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        // Liste des champs de métriques (tous INTEGER nullable)
        const metricFields = [
            'nombre_personnes',
            'nombre_menages',
            'nombre_femmes',
            'nombre_mineurs',
            'sante_nombre_personnes',
            'travail_nombre_personnes',
            'travail_nombre_femmes',
            'hebergement_nombre_personnes',
            'hebergement_nombre_menages',
            'logement_nombre_personnes',
            'logement_nombre_menages',
            'scolaire_mineurs_scolarisables',
            'scolaire_mineurs_en_mediation',
            'scolaire_nombre_maternelle',
            'scolaire_nombre_elementaire',
            'scolaire_nombre_college',
            'scolaire_nombre_lycee',
            'scolaire_nombre_autre',
            'scolaire_mineur_scolarise_dans_annee',
        ];

        // Construire l'objet des colonnes de métriques
        const metricColumns = metricFields.reduce((acc, fieldName) => {
            acc[fieldName] = nullableInteger();
            return acc;
        }, {});

        try {
            // Création de la table action_metrics_history
            await queryInterface.createTable(
                'action_metrics_history',
                {
                    fk_action: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                    },
                    date: {
                        type: Sequelize.DATEONLY,
                        allowNull: false,
                        primaryKey: true,
                    },
                    ...metricColumns,
                    created_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        primaryKey: true,
                    },
                    created_by: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                },
                {
                    transaction,
                },
            );

            // Création des contraintes (clés étrangères)
            await queryInterface.addConstraint('action_metrics_history', {
                fields: ['fk_action'],
                type: 'foreign key',
                name: 'fk__action_metrics_history__action',
                references: {
                    table: 'actions_history',
                    field: 'hid',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            });

            await queryInterface.addConstraint('action_metrics_history', {
                fields: ['created_by'],
                type: 'foreign key',
                name: 'fk__action_metrics_history__creator',
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
                'action_metrics_history',
                'fk__action_metrics_history__action',
                { transaction },
            );
            await queryInterface.removeConstraint(
                'action_metrics_history',
                'fk__action_metrics_history__creator',
                { transaction },
            );

            await queryInterface.dropTable('action_metrics_history', { transaction });

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
