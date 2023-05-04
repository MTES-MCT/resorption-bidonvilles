module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.sequelize.query(
                'INSERT INTO features(name, fk_entity, is_writing) VALUES(\'report\', \'shantytown\', false)',
                { transaction },
            );

            await queryInterface.bulkInsert(
                'role_permissions',
                [
                    {
                        fk_role_admin: 'local_admin', fk_feature: 'report', fk_entity: 'shantytown', allowed: true, allow_all: false,
                    },
                    {
                        fk_role_admin: 'national_admin', fk_feature: 'report', fk_entity: 'shantytown', allowed: true, allow_all: true,
                    },
                    {
                        fk_role_regular: 'association', fk_feature: 'report', fk_entity: 'shantytown', allowed: true, allow_all: false,
                    },
                    {
                        fk_role_regular: 'collaborator', fk_feature: 'report', fk_entity: 'shantytown', allowed: true, allow_all: false,
                    },
                    {
                        fk_role_regular: 'direct_collaborator', fk_feature: 'report', fk_entity: 'shantytown', allowed: true, allow_all: false,
                    },
                    {
                        fk_role_regular: 'external_observator', fk_feature: 'report', fk_entity: 'shantytown', allowed: true, allow_all: false,
                    },
                    {
                        fk_role_regular: 'intervener', fk_feature: 'report', fk_entity: 'shantytown', allowed: true, allow_all: false,
                    },
                    {
                        fk_role_regular: 'national_establisment', fk_feature: 'report', fk_entity: 'shantytown', allowed: true, allow_all: false,
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
                'DELETE FROM role_permissions WHERE fk_feature = \'report\' AND fk_entity = \'shantytown\'',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DELETE FROM features WHERE name = \'report\' AND fk_entity = \'shantytown\'',
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
