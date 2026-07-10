module.exports = {
    up: async (queryInterface) => {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // Insérer la phase 'Diagnostic technique' en cours pour tous les sites
            // dont la résorption a déjà démarré (présence d'une phase 'sociological_diagnosis')
            // et qui n'ont pas encore cette phase
            // Le created_by est récupéré à partir de la phase 'sociological_diagnosis' du site
            // completed_at = null : intention métier -> les utilisateurs doivent déclarer eux-mêmes l'état de cette phase pour les sites existants
            await queryInterface.sequelize.query(
                `INSERT INTO shantytown_preparatory_phases_toward_resorption
                    (fk_shantytown, fk_preparatory_phase, created_by, completed_at)
                 SELECT
                    s.fk_shantytown,
                    'technical_diagnosis',
                    s.created_by,
                    NULL
                 FROM shantytown_preparatory_phases_toward_resorption s
                 WHERE s.fk_preparatory_phase = 'sociological_diagnosis'
                 AND NOT EXISTS (
                    SELECT 1
                    FROM shantytown_preparatory_phases_toward_resorption t
                    WHERE t.fk_shantytown = s.fk_shantytown
                    AND t.fk_preparatory_phase = 'technical_diagnosis'
                 )`,
                { transaction },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: async (queryInterface) => {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // Supprimer les phases 'technical_diagnosis' en cours ajoutées par cette migration
            // pour les sites ayant une phase 'sociological_diagnosis'
            await queryInterface.sequelize.query(
                `DELETE FROM shantytown_preparatory_phases_toward_resorption td
                 WHERE td.fk_preparatory_phase = 'technical_diagnosis'
                 AND td.completed_at IS NULL
                 AND EXISTS (
                    SELECT 1
                    FROM shantytown_preparatory_phases_toward_resorption s
                    WHERE s.fk_shantytown = td.fk_shantytown
                    AND s.fk_preparatory_phase = 'sociological_diagnosis'
                 )`,
                { transaction },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
