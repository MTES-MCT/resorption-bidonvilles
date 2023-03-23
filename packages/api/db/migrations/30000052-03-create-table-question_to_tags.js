module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.createTable(
            'question_to_tags',
            {
                fk_question: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                fk_question_tag: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                transaction,
            },
        );


        await Promise.all([
            queryInterface.addConstraint(
                'question_to_tags', {
                    fields: ['fk_question'],
                    type: 'foreign key',
                    name: 'fk_question_question_to_tags',
                    references: {
                        table: 'questions',
                        field: 'question_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'question_to_tags', {
                    fields: ['fk_question_tag'],
                    type: 'foreign key',
                    name: 'fk_question_tag_question_to_tags',
                    references: {
                        table: 'question_tags',
                        field: 'uid',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ),
        ]);

        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all([
            queryInterface.removeConstraint(
                'question_to_tags',
                'fk_question_question_to_tags',
                {
                    transaction,
                },
            ),
            queryInterface.removeConstraint(
                'question_to_tags',
                'fk_question_tag_question_to_tags',
                {
                    transaction,
                },
            ),
        ]);
        await queryInterface.dropTable('question_to_tags', { transaction });
        return transaction.commit();
    },
};
