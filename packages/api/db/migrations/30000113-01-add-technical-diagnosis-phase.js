module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            // 1. Insérer la nouvelle phase "Diagnostic technique" en position 4
            await queryInterface.bulkInsert(
                'preparatory_phases_toward_resorption',
                [
                    {
                        uid: 'technical_diagnosis',
                        name: 'Diagnostic technique',
                        is_a_starting_phase: true,
                        date_label: 'Réalisé',
                        position: 2,
                    },
                ],
                { transaction },
            );

            // 2. Mettre à jour les positions des phases existantes (décaler de +1 à partir de l'ancienne position 4)
            const positionUpdates = [
                { uid: 'social_assessment', newPosition: 3 },
                { uid: 'political_validation', newPosition: 4 },
                { uid: 'contract_preparation', newPosition: 5 },
                { uid: 'land_equipment_development', newPosition: 6 },
                { uid: 'family_information', newPosition: 7 },
                { uid: 'contractualization_of_families', newPosition: 8 },
                { uid: 'official_opening', newPosition: 9 },
            ];

            const updatePromises = positionUpdates.map(({ uid, newPosition }) => queryInterface.bulkUpdate(
                'preparatory_phases_toward_resorption',
                { position: newPosition },
                { uid: { [Sequelize.Op.eq]: uid } },
                { transaction },
            ));

            await Promise.all(updatePromises);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            // 1. Supprimer la phase "Diagnostic technique"
            await queryInterface.bulkDelete(
                'preparatory_phases_toward_resorption',
                { uid: 'technical_diagnosis' },
                { transaction },
            );

            // 2. Restaurer les positions originales des phases existantes (décaler de -1 à partir de l'ancienne position 5)
            const positionUpdates = [
                { uid: 'social_assessment', newPosition: 2 },
                { uid: 'political_validation', newPosition: 3 },
                { uid: 'contract_preparation', newPosition: 4 },
                { uid: 'land_equipment_development', newPosition: 5 },
                { uid: 'family_information', newPosition: 6 },
                { uid: 'contractualization_of_families', newPosition: 7 },
                { uid: 'official_opening', newPosition: 8 },
            ];

            const updatePromises = positionUpdates.map(({ uid, newPosition }) => queryInterface.bulkUpdate(
                'preparatory_phases_toward_resorption',
                { position: newPosition },
                { uid: { [Sequelize.Op.eq]: uid } },
                { transaction },
            ));

            await Promise.all(updatePromises);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
