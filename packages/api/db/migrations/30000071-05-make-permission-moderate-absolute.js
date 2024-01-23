module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.bulkInsert(
                'entities',
                [{ name: 'data' }],
                { transaction },
            );
            await queryInterface.bulkInsert(
                'features',
                [{ name: 'moderate', fk_entity: 'data', is_writing: true }],
                { transaction },
            );
            await Promise.all([
                queryInterface.sequelize.query(
                    'UPDATE role_permissions SET fk_entity = \'data\' WHERE fk_feature = \'moderate\'',
                    { transaction },
                ),
                queryInterface.sequelize.query(
                    'UPDATE permissions SET fk_entity = \'data\' WHERE fk_feature = \'moderate\'',
                    { transaction },
                ),
            ]);
            await queryInterface.sequelize.query(
                'DELETE FROM features WHERE name = \'moderate\' AND fk_entity = \'shantytown_comment\'',
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
            await queryInterface.bulkInsert(
                'features',
                [{ name: 'moderate', fk_entity: 'shantytown_comment', is_writing: true }],
                { transaction },
            );
            await Promise.all([
                queryInterface.sequelize.query(
                    'UPDATE role_permissions SET fk_entity = \'shantytown_comment\' WHERE fk_feature = \'moderate\'',
                    { transaction },
                ),
                queryInterface.sequelize.query(
                    'UPDATE permissions SET fk_entity = \'shantytown_comment\' WHERE fk_feature = \'moderate\'',
                    { transaction },
                ),
            ]);
            await queryInterface.sequelize.query(
                'DELETE FROM features WHERE name = \'moderate\' AND fk_entity = \'data\'',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DELETE FROM entities WHERE name = \'data\'',
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
