module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // 1. Drop triggers and constraints from question_attachments and answer_attachments
            await Promise.all([
                queryInterface.sequelize.query(
                    'DROP TRIGGER IF EXISTS delete_actual_attachment ON question_attachments',
                    { transaction },
                ),
                queryInterface.sequelize.query(
                    'DROP TRIGGER IF EXISTS delete_actual_attachment ON answer_attachments',
                    { transaction },
                ),
            ]);

            await Promise.all([
                queryInterface.removeConstraint('question_attachments', 'fk_question', { transaction }),
                queryInterface.removeConstraint('question_attachments', 'fk_attachment', { transaction }),
                queryInterface.removeConstraint('answer_attachments', 'fk_answer', { transaction }),
                queryInterface.removeConstraint('answer_attachments', 'fk_attachment', { transaction }),
            ]);

            // 2. Drop question_attachments and answer_attachments tables
            await Promise.all([
                queryInterface.dropTable('question_attachments', { transaction }),
                queryInterface.dropTable('answer_attachments', { transaction }),
            ]);

            // 3. Drop question_to_tags table (FK vers questions et question_tags)
            await Promise.all([
                queryInterface.removeConstraint('question_to_tags', 'fk_question_question_to_tags', { transaction }),
                queryInterface.removeConstraint('question_to_tags', 'fk_question_tag_question_to_tags', { transaction }),
            ]);
            await queryInterface.dropTable('question_to_tags', { transaction });

            // 4. Drop user_question_subscriptions table (FK vers users et questions)
            await Promise.all([
                queryInterface.removeConstraint('user_question_subscriptions', 'fk__user_question_subscriptions__user', { transaction }),
                queryInterface.removeConstraint('user_question_subscriptions', 'fk__user_question_subscriptions__question', { transaction }),
            ]);
            await queryInterface.dropTable('user_question_subscriptions', { transaction });

            // 5. Drop answers table (FK vers questions)
            await Promise.all([
                queryInterface.removeConstraint('answers', 'fk_answers_question', { transaction }),
                queryInterface.removeConstraint('answers', 'fk_answer_creator', { transaction }),
            ]);
            await queryInterface.dropTable('answers', { transaction });

            // 6. Drop questions table (FK vers users)
            await queryInterface.removeConstraint('questions', 'fk_question_creator', { transaction });
            await queryInterface.dropTable('questions', { transaction });

            // 7. Drop question_tags table
            await queryInterface.removeConstraint('question_tags', 'uk_question_tags_name', { transaction });
            await queryInterface.dropTable('question_tags', { transaction });

            // 8. Delete email subscription
            await queryInterface.sequelize.query(
                'DELETE FROM user_email_unsubscriptions WHERE email_subscription = \'community_new_question\'',
                { transaction },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down() {
        throw new Error('Cette migration est irréversible : les tables questions/answers et leurs données ont été supprimées définitivement.');
    },
};
