// actions
module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                `
                    INSERT INTO action_comments(
                        action_comment_id,
                        fk_action,
                        description,
                        created_at,
                        created_by
                    )

                    SELECT
                        plan_comment_id,
                        fk_plan,
                        description,
                        created_at,
                        created_by
                    FROM plan_comments
                `,
                { transaction },
            );

            // reset sequence of primary key
            const [{ max }] = await queryInterface.sequelize.query(
                'SELECT action_comment_id AS max FROM action_comments ORDER BY action_comment_id DESC LIMIT 1',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            );
            await Promise.all([
                queryInterface.sequelize.query(
                    'ALTER SEQUENCE action_comments_action_comment_id_seq RESTART WITH :max',
                    {
                        transaction,
                        replacements: {
                            max: parseInt(max, 10) + 1,
                        },
                    },
                ),
            ]);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: queryInterface => queryInterface.sequelize.query(
        'DELETE FROM action_comments',
    ),
};
