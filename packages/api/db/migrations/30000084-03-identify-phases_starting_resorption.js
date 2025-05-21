module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.bulkUpdate(
                'preparatory_phases_toward_resorption',
                {
                    is_a_starting_phase: true,
                },
                {
                    uid: {
                        [Sequelize.Op.in]: ['sociological_diagnosis',
                            'social_assessment',
                            'political_validation',
                        ],
                    },
                },
                { transaction },
            );
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.bulkUpdate(
                'preparatory_phases_toward_resorption',
                {
                    is_a_starting_phase: false,
                },
                {
                    uid: {
                        [Sequelize.Op.in]: [
                            'sociological_diagnosis',
                            'social_assessment',
                            'political_validation',
                        ],
                    },
                },
                { transaction },
            );
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
