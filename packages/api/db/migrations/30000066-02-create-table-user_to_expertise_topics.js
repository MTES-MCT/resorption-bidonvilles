module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.createTable(
                'user_to_expertise_topics',
                {
                    fk_user: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                    },
                    fk_expertise_topic: {
                        type: Sequelize.STRING,
                        allowNull: false,
                        primaryKey: true,
                    },
                    type: {
                        type: Sequelize.ENUM('expertise', 'interest'),
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
                    'user_to_expertise_topics', {
                        fields: ['fk_user'],
                        type: 'foreign key',
                        name: 'fk_user_to_expertise_topics__user',
                        references: {
                            table: 'users',
                            field: 'user_id',
                        },
                        onUpdate: 'cascade',
                        onDelete: 'cascade',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'user_to_expertise_topics', {
                        fields: ['fk_expertise_topic'],
                        type: 'foreign key',
                        name: 'fk_user_to_expertise_topics__topic',
                        references: {
                            table: 'expertise_topics',
                            field: 'uid',
                        },
                        onUpdate: 'cascade',
                        onDelete: 'cascade',
                        transaction,
                    },
                ),
            ]);

            return transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all([
                queryInterface.removeConstraint(
                    'user_to_expertise_topics',
                    'fk_user_to_expertise_topics__topic',
                    {
                        transaction,
                    },
                ),
                queryInterface.removeConstraint(
                    'user_to_expertise_topics',
                    'fk_user_to_expertise_topics__user',
                    {
                        transaction,
                    },
                ),
            ]);
            await queryInterface.dropTable('user_to_expertise_topics', { transaction });
            return transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
};
