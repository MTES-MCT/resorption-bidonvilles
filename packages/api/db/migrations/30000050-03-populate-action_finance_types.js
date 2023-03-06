// actions
module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                `
                    INSERT INTO action_finance_types(
                        uid,
                        name
                    )

                    SELECT
                        uid,
                        name
                    FROM finance_types
                `,
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: queryInterface => queryInterface.sequelize.query(
        'DELETE FROM action_finance_types',
    ),
};
