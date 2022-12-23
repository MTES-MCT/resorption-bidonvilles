module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.createTable(
            'questions',
            {
                question_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                question: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                details: {
                    type: Sequelize.TEXT,
                    allowNull: false, // false ou true ?
                },
                other_tags: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                people_affected: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
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
                solved_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: null,
                },
                created_by: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
            },
            { transaction },
        );

        await queryInterface.addConstraint('questions', {
            fields: ['created_by'],
            type: 'foreign key',
            name: 'fk_question_creator',
            references: {
                table: 'users',
                field: 'user_id',
            },
            onUpdate: 'cascade',
            onDelete: 'restrict',
            transaction,
        });

        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.removeConstraint(
            'questions',
            'fk_question_creator',
            { transaction },
        );

        await queryInterface.dropTable('questions', { transaction });

        return transaction.commit();
    },
};
