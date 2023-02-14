// actions
module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.sequelize.query(
                'INSERT INTO entities(name) VALUES (\'action\'), (\'action_comment\')',
                {
                    type: queryInterface.sequelize.QueryTypes.INSERT,
                    transaction,
                },
            );
            await queryInterface.sequelize.query(
                `INSERT INTO features
                    (name, fk_entity, is_writing)
                    VALUES
                    ('read', 'action', false),
                    ('create', 'action', true),
                    ('update', 'action', true),
                    ('export', 'action', false),
                    ('read', 'action_comment', false),
                    ('export', 'action_comment', false),
                    ('create', 'action_comment', true)`,
                {
                    type: queryInterface.sequelize.QueryTypes.INSERT,
                    transaction,
                },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.sequelize.query(
                'DELETE FROM features WHERE fk_entity IN (\'action\', \'action_comment\')',
                {
                    transaction,
                },
            );
            await queryInterface.sequelize.query(
                'DELETE FROM entities WHERE name IN (\'action\', \'action_comment\')',
                {
                    transaction,
                },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
