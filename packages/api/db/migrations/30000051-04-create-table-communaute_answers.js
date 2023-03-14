module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.createTable(
            'answers',
            {
                answer_id: {
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
            queryInterface.addConstraint('answers', {
                fields: ['fk_question'],
                type: 'foreign key',
                name: 'fk_answers_question',
                references: {
                    table: 'questions',
                    field: 'question_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            }),

            queryInterface.addConstraint('answers', {
                fields: ['created_by'],
                type: 'foreign key',
                name: 'fk_answer_creator',
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
            queryInterface.removeConstraint('answers', 'fk_answers_question', { transaction }),
            queryInterface.removeConstraint('answers', 'fk_answer_creator', { transaction }),
        ]);

        await queryInterface.dropTable('answers', { transaction });

        await transaction.commit();
    },
};
