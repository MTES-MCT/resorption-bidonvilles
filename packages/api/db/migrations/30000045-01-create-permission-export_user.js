module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.sequelize.query(
                'INSERT INTO features(name, fk_entity, is_writing) VALUES(\'export\', \'user\', false)',
                { transaction },
            );

            await queryInterface.bulkInsert(
                'role_permissions',
                [
                    {
                        fk_role_admin: 'local_admin', fk_feature: 'export', fk_entity: 'user', allowed: true, allow_all: false,
                    },
                    {
                        fk_role_admin: 'national_admin', fk_feature: 'export', fk_entity: 'user', allowed: true, allow_all: true,
                    },
                ],
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },


    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.sequelize.query(
                'DELETE FROM role_permissions WHERE fk_feature = \'export\' AND fk_entity = \'user\'',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DELETE FROM features WHERE name = \'export\' AND fk_entity = \'user\'',
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
