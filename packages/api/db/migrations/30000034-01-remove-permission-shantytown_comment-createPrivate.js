module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.sequelize.query(
            'DELETE FROM features WHERE fk_entity = \'shantytown_comment\' AND name = \'createPrivate\'',
            {
                transaction,
            },
        );

        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        await queryInterface.sequelize.query(
            'INSERT INTO features(name, fk_entity, is_writing) VALUES (\'createPrivate\', \'shantytown_comment\', true)',
            { transaction },
        );
        await queryInterface.bulkInsert(
            'role_permissions',
            [
                {
                    fk_role_admin: 'local_admin', fk_feature: 'createPrivate', fk_entity: 'shantytown_comment', allowed: true, allow_all: false,
                },
                {
                    fk_role_admin: 'national_admin', fk_feature: 'createPrivate', fk_entity: 'shantytown_comment', allowed: true, allow_all: false,
                },
            ],
            { transaction },
        );

        return transaction.commit();
    },
};
