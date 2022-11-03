module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all(
            [
                queryInterface.sequelize.query(
                    'INSERT INTO features(name, fk_entity, is_writing) VALUES(\'export\', \'plan_comment\', false)',
                    {
                        transaction,
                    },
                ),
                queryInterface.sequelize.query(
                    `INSERT INTO role_permissions(fk_role_admin, fk_feature, fk_entity, allowed, allow_all)
                VALUES
                    ('national_admin', 'export', 'plan_comment', true, true)`,
                    {
                        transaction,
                    },
                ),
            ],
        );

        await transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();


        await Promise.all(
            [
                queryInterface.sequelize.query(
                    'DELETE FROM role_permissions WHERE fk_feature = \'export\' AND fk_entity = \'plan_comment\'',
                    {
                        transaction,
                    },
                ),
                queryInterface.sequelize.query(
                    'DELETE FROM features WHERE name = \'export\' AND fk_entity = \'plan_comment\'',
                    {
                        transaction,
                    },
                ),
            ],
        );

        await transaction.commit();
    },

};
