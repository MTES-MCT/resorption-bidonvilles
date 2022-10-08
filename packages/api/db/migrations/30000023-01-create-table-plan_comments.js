module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.createTable(
            'plan_comments',
            {
                plan_comment_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                fk_plan: {
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
            queryInterface.addConstraint('plan_comments', {
                fields: ['fk_plan'],
                type: 'foreign key',
                name: 'fk_plan_comments_plan',
                references: {
                    table: 'plans2',
                    field: 'plan_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            }),

            queryInterface.addConstraint('plan_comments', {
                fields: ['created_by'],
                type: 'foreign key',
                name: 'fk_plan_comment_creator',
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

    down: queryInterface => queryInterface.dropTable('plan_comments'),
};
