module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                `
                    UPDATE shantytowns
                       SET police_status = NULL
                     WHERE s.police_status IS NOT NULL 
                     AND 
                    (
                            s.justice_procedure IS NULL
                        AND
                            s.evacuation_under_time_limit IS NULL
                        AND
                            s.insalubrity_order IS NULL
                    )
                    AND
                        s.status = 'open' ;`,
                { transaction },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down() {
        // Migration irreversible
    },
};
