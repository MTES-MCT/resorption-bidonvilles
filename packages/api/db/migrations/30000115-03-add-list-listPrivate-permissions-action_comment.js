module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                `INSERT INTO features(name, fk_entity, is_writing)
                VALUES
                    ('list', 'action_comment', false),
                    ('listPrivate', 'action_comment', false)`,
                {
                    transaction,
                },
            );

            await queryInterface.sequelize.query(
                `INSERT INTO role_permissions(fk_role_regular, fk_feature, fk_entity, allowed, allow_all)
                VALUES
                    ('association', 'list', 'action_comment', true, false),
                    ('collaborator', 'list', 'action_comment', true, false),
                    ('direct_collaborator', 'list', 'action_comment', true, true),
                    ('external_observator', 'list', 'action_comment', true, false),
                    ('intervener', 'list', 'action_comment', true, false),
                    ('national_establisment', 'list', 'action_comment', true, true)`,
                {
                    transaction,
                },
            );

            await queryInterface.sequelize.query(
                `INSERT INTO role_permissions(fk_role_admin, fk_feature, fk_entity, allowed, allow_all)
                VALUES
                    ('local_admin', 'listPrivate', 'action_comment', true, true),
                    ('national_admin', 'listPrivate', 'action_comment', true, true)`,
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

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                'DELETE FROM role_permissions WHERE fk_entity = \'action_comment\' AND fk_feature IN (\'list\', \'listPrivate\')',
                {
                    transaction,
                },
            );

            await queryInterface.sequelize.query(
                'DELETE FROM features WHERE fk_entity = \'action_comment\' AND name IN (\'list\', \'listPrivate\')',
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
