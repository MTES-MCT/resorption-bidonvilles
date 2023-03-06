// actions
module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                `INSERT INTO action_finances (fk_action, year, amount, real_amount, "comments", fk_action_finance_type) 
                (
                    SELECT
                        f.fk_plan AS fk_action,
                        f.year,
                        fr.amount,
                        fr.real_amount,
                        fr."comments",
                        fr.fk_finance_type AS fk_action_finance_type
                    FROM
                        finance_rows fr
                    LEFT JOIN
                        finances f ON f.finance_id = fr.fk_finance
                )`,
                { transaction },
            );
            await queryInterface.sequelize.query(
                `INSERT INTO action_finances_history (fk_action, year, amount, real_amount, "comments", fk_action_finance_type) 
                (
                    SELECT
                        f.fk_plan AS fk_action,
                        f.year,
                        fr.amount,
                        fr.real_amount,
                        fr."comments",
                        fr.fk_finance_type AS fk_action_finance_type
                    FROM
                        finance_rows_history fr
                    LEFT JOIN
                        finances_history f ON f.finance_id = fr.fk_finance
                )`,
                { transaction },
            );
            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all([
            queryInterface.sequelize.query(
                'DELETE FROM action_finances',
                { transaction },
            ),
            queryInterface.sequelize.query(
                'DELETE FROM action_finances_history',
                { transaction },
            ),
        ]);
        return transaction.commit();
    },
};
