// actions
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        function addConstraintLowerThan(colA, colB) {
            return queryInterface.addConstraint('action_metrics', {
                fields: [colA, colB],
                type: 'check',
                name: `check__${colA}_lte_${colB}`,
                where: {
                    [Sequelize.Op.or]: [
                        { [colB]: { [Sequelize.Op.eq]: null } },
                        { [colA]: { [Sequelize.Op.eq]: null } },
                        {
                            [colB]: { [Sequelize.Op.ne]: null },
                            [colA]: {
                                [Sequelize.Op.ne]: null,
                                [Sequelize.Op.lte]: Sequelize.col(colB),
                            },
                        },
                    ],
                },
                transaction,
            });
        }

        try {
            // création des tables
            await queryInterface.createTable(
                'action_metrics',
                {
                    fk_action: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                    },
                    date: {
                        type: Sequelize.DATEONLY,
                        allowNull: false,
                    },
                    nombre_personnes: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    nombre_menages: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    nombre_femmes: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    nombre_mineurs: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    sante_nombre_personnes: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    travail_nombre_personnes: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    travail_nombre_femmes: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    hebergement_nombre_personnes: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    hebergement_nombre_menages: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    logement_nombre_personnes: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    logement_nombre_menages: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    scolaire_mineurs_scolarisables: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    scolaire_mineurs_en_mediation: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    scolaire_nombre_maternelle: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    scolaire_nombre_elementaire: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    scolaire_nombre_college: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    scolaire_nombre_lycee: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    scolaire_nombre_autre: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    created_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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

            // création des contraintes (clés étrangères, checks...)
            await Promise.all([
                queryInterface.addConstraint('action_metrics', {
                    fields: ['fk_action'],
                    type: 'foreign key',
                    name: 'fk__action_metrics__action',
                    references: {
                        table: 'actions',
                        field: 'action_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
                queryInterface.addConstraint('action_metrics', {
                    fields: ['created_by'],
                    type: 'foreign key',
                    name: 'fk__action_metrics__creator',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                }),
                addConstraintLowerThan('nombre_femmes', 'nombre_personnes'),
                addConstraintLowerThan('nombre_menages', 'nombre_personnes'),
                addConstraintLowerThan('nombre_mineurs', 'nombre_personnes'),
                addConstraintLowerThan('sante_nombre_personnes', 'nombre_personnes'),
                addConstraintLowerThan('travail_nombre_personnes', 'nombre_personnes'),
                addConstraintLowerThan('travail_nombre_femmes', 'nombre_personnes'),
                addConstraintLowerThan('travail_nombre_femmes', 'nombre_femmes'),
                addConstraintLowerThan('hebergement_nombre_personnes', 'nombre_personnes'),
                addConstraintLowerThan('hebergement_nombre_menages', 'nombre_personnes'),
                addConstraintLowerThan('hebergement_nombre_menages', 'nombre_menages'),
                addConstraintLowerThan('logement_nombre_personnes', 'nombre_personnes'),
                addConstraintLowerThan('logement_nombre_menages', 'nombre_personnes'),
                addConstraintLowerThan('logement_nombre_menages', 'nombre_menages'),
                addConstraintLowerThan('scolaire_mineurs_scolarisables', 'nombre_mineurs'),
                addConstraintLowerThan('scolaire_mineurs_en_mediation', 'nombre_mineurs'),
                addConstraintLowerThan('scolaire_nombre_maternelle', 'nombre_mineurs'),
                addConstraintLowerThan('scolaire_nombre_elementaire', 'nombre_mineurs'),
                addConstraintLowerThan('scolaire_nombre_college', 'nombre_mineurs'),
                addConstraintLowerThan('scolaire_nombre_lycee', 'nombre_mineurs'),
                addConstraintLowerThan('scolaire_nombre_autre', 'nombre_mineurs'),
            ]);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        function removeConstraintLowerThan(colA, colB) {
            return queryInterface.removeConstraint(
                'action_metrics',
                `check__${colA}_lte_${colB}`,
                { transaction },
            );
        }

        try {
            await Promise.all([
                queryInterface.removeConstraint(
                    'action_metrics',
                    'fk__action_metrics__action',
                    { transaction },
                ),
                queryInterface.removeConstraint(
                    'action_metrics',
                    'fk__action_metrics__creator',
                    { transaction },
                ),
                removeConstraintLowerThan('nombre_femmes', 'nombre_personnes'),
                removeConstraintLowerThan('nombre_menages', 'nombre_personnes'),
                removeConstraintLowerThan('nombre_mineurs', 'nombre_personnes'),
                removeConstraintLowerThan('sante_nombre_personnes', 'nombre_personnes'),
                removeConstraintLowerThan('travail_nombre_personnes', 'nombre_personnes'),
                removeConstraintLowerThan('travail_nombre_femmes', 'nombre_personnes'),
                removeConstraintLowerThan('travail_nombre_femmes', 'nombre_femmes'),
                removeConstraintLowerThan('hebergement_nombre_personnes', 'nombre_personnes'),
                removeConstraintLowerThan('hebergement_nombre_menages', 'nombre_personnes'),
                removeConstraintLowerThan('hebergement_nombre_menages', 'nombre_menages'),
                removeConstraintLowerThan('logement_nombre_personnes', 'nombre_personnes'),
                removeConstraintLowerThan('logement_nombre_menages', 'nombre_personnes'),
                removeConstraintLowerThan('logement_nombre_menages', 'nombre_menages'),
                removeConstraintLowerThan('scolaire_mineurs_scolarisables', 'nombre_mineurs'),
                removeConstraintLowerThan('scolaire_mineurs_en_mediation', 'nombre_mineurs'),
                removeConstraintLowerThan('scolaire_nombre_maternelle', 'nombre_mineurs'),
                removeConstraintLowerThan('scolaire_nombre_elementaire', 'nombre_mineurs'),
                removeConstraintLowerThan('scolaire_nombre_college', 'nombre_mineurs'),
                removeConstraintLowerThan('scolaire_nombre_lycee', 'nombre_mineurs'),
                removeConstraintLowerThan('scolaire_nombre_autre', 'nombre_mineurs'),
            ]);

            await queryInterface.dropTable('action_metrics', { transaction });

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
