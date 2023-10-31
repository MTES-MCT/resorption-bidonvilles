module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.createTable(
                'expertise_topics',
                {
                    uid: {
                        type: Sequelize.STRING,
                        allowNull: false,
                        primaryKey: true,
                    },
                    label: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    created_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    },
                },
                {
                    transaction,
                },
            );

            await queryInterface.bulkInsert(
                'expertise_topics',
                [
                    { uid: 'sante', label: 'Santé' },
                    { uid: 'education', label: 'Éducation et scolarisation' },
                    { uid: 'protection_enfance', label: 'Protection de l\'enfance' },
                    { uid: 'emploi', label: 'Formation et emploi' },
                    { uid: 'logement', label: 'Logement et hébergement' },
                    { uid: 'accompagnement_social', label: 'Accompagnement social' },
                    { uid: 'diagnostic', label: 'Diagnostic et connaissance des publics' },
                    { uid: 'eau', label: 'Accès à l\'eau' },
                    { uid: 'electricite', label: 'Accès à l\'électricité' },
                    { uid: 'dechets', label: 'Gestion des déchets' },
                    { uid: 'incendie', label: 'Prévention des incendies' },
                    { uid: 'pilotage', label: 'Pilotage et coordination' },
                    { uid: 'administratif', label: 'Accompagnement administratif et juridique' },
                    { uid: 'ordre_public', label: 'Respect de l\'ordre public' },
                    { uid: 'financement', label: 'Financement d\'actions' },
                ],
                { transaction },
            );

            return transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    down: queryInterface => queryInterface.dropTable('expertise_topics'),
};
