module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                'DELETE FROM features WHERE fk_entity = \'covid_comment\'',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DELETE FROM entities WHERE name = \'covid_comment\'',
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
            await queryInterface.bulkInsert(
                'entities',
                [{ name: 'covid_comment' }],
                { transaction },
            );
            await queryInterface.bulkInsert(
                'features',
                [{ name: 'list', fk_entity: 'covid_comment', is_writing: false }],
                { transaction },
            );
            await queryInterface.bulkInsert(
                'role_permissions',
                [
                    {
                        fk_role_regular: 'association',
                        fk_feature: 'list',
                        fk_entity: 'covid_comment',
                        allowed: true,
                        allow_all: false,
                    },
                    {
                        fk_role_regular: 'collaborator',
                        fk_feature: 'list',
                        fk_entity: 'covid_comment',
                        allowed: true,
                        allow_all: false,
                    },
                    {
                        fk_role_regular: 'direct_collaborator',
                        fk_feature: 'list',
                        fk_entity: 'covid_comment',
                        allowed: true,
                        allow_all: false,
                    },
                    {
                        fk_role_regular: 'external_observator',
                        fk_feature: 'list',
                        fk_entity: 'covid_comment',
                        allowed: true,
                        allow_all: false,
                    },
                    {
                        fk_role_regular: 'intervener',
                        fk_feature: 'list',
                        fk_entity: 'covid_comment',
                        allowed: true,
                        allow_all: false,
                    },
                    {
                        fk_role_regular: 'national_establisment',
                        fk_feature: 'list',
                        fk_entity: 'covid_comment',
                        allowed: true,
                        allow_all: false,
                    },
                    {
                        fk_role_admin: 'local_admin',
                        fk_feature: 'list',
                        fk_entity: 'covid_comment',
                        allowed: true,
                        allow_all: false,
                    },
                    {
                        fk_role_admin: 'national_admin',
                        fk_feature: 'list',
                        fk_entity: 'covid_comment',
                        allowed: true,
                        allow_all: true,
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
};
