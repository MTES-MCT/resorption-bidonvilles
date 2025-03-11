module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all([
                queryInterface.sequelize.query(
                    `UPDATE shantytowns SET owner = NULL WHERE shantytown_id IN
                        (
                            SELECT shantytown_id FROM shantytowns WHERE status NOT LIKE 'open' AND fk_owner_type = 3 AND owner IS NOT NULL
                        ) ;`,
                    {
                        type: queryInterface.sequelize.QueryTypes.UPDATE,
                        transaction,
                    },
                ),
                queryInterface.sequelize.query(
                    `UPDATE "ShantytownHistories" 
                    SET owner = NULL
                    WHERE 
                        shantytown_id IN 
                            (
                                SELECT shantytown_id FROM shantytowns WHERE status NOT LIKE 'open' AND fk_owner_type = 3 AND owner IS NOT NULL
                            )
                        AND
                            owner IS NOT NULL ;`,
                    {
                        type: queryInterface.sequelize.QueryTypes.UPDATE,
                        transaction,
                    },
                ),
            ]);
            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: () => Promise.resolve(),
};
