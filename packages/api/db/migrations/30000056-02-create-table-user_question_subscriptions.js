module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.createTable(
            'user_question_subscriptions',
            {
                fk_user: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                fk_question: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                active: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    default: true,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: null,
                    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
        );
        await Promise.all([
            queryInterface.addConstraint('user_question_subscriptions', {
                fields: ['fk_user'],
                type: 'foreign key',
                name: 'fk__user_question_subscriptions__user',
                references: {
                    table: 'users',
                    field: 'user_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            }),

            queryInterface.addConstraint('user_question_subscriptions', {
                fields: ['fk_question'],
                type: 'foreign key',
                name: 'fk__user_question_subscriptions__question',
                references: {
                    table: 'questions',
                    field: 'question_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            }),
        ]);

        await transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all([
            queryInterface.removeConstraint('user_question_subscriptions', 'fk__user_question_subscriptions__question', { transaction }),
            queryInterface.removeConstraint('user_question_subscriptions', 'fk__user_question_subscriptions__user', { transaction }),
        ]);

        await queryInterface.dropTable('user_question_subscriptions', { transaction });

        await transaction.commit();
    },
};
