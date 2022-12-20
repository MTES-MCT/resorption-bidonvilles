module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.createTable(
            'communaute_answers',
            {
                communaute_answer_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                fk_question: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                created_by: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
        );
        await Promise.all([
            queryInterface.addConstraint('communaute_answers', {
                fields: ['fk_question'],
                type: 'foreign key',
                name: 'fk_communaute_answers_question',
                references: {
                    table: 'communaute_questions',
                    field: 'communaute_question_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            }),

            queryInterface.addConstraint('communaute_answers', {
                fields: ['created_by'],
                type: 'foreign key',
                name: 'fk_communaute_answer_creator',
                references: {
                    table: 'users',
                    field: 'user_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
            }),
        ]);

        await transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all([
            queryInterface.removeConstraint('communaute_answers', 'fk_communaute_answers_question', { transaction }),
            queryInterface.removeConstraint('communaute_answers', 'fk_communaute_answer_creator', { transaction }),
        ]);

        await queryInterface.dropTable('communaute_answers', { transaction });

        await transaction.commit();
    },
};
