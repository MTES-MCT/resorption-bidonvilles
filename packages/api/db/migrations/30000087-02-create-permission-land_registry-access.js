module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.bulkInsert(
                'entities',
                [{ name: 'land_registry' }],
                { transaction },
            );
            await queryInterface.bulkInsert(
                'features',
                [{ name: 'access', fk_entity: 'land_registry', is_writing: true }],
                { transaction },
            );
            await queryInterface.bulkInsert(
                'role_permissions',
                [
                    {
                        fk_role_admin: 'national_admin', fk_feature: 'access', fk_entity: 'land_registry', allowed: true, allow_all: true,
                    },
                    {
                        fk_role_regular: 'direct_collaborator', fk_feature: 'access', fk_entity: 'land_registry', allowed: true, allow_all: false,
                    },
                ],
                { transaction },
            );
            return transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.sequelize.query(
                'DELETE FROM role_permissions WHERE fk_feature = \'access\' AND fk_entity = \'land_registry\'',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DELETE FROM features WHERE name = \'access\' AND fk_entity = \'land_registry\'',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DELETE FROM entities WHERE name = \'land_registry\'',
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
