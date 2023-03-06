module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.sequelize.query(
                'INSERT INTO entities(name) VALUES (\'action_finances\')',
                {
                    type: queryInterface.sequelize.QueryTypes.INSERT,
                    transaction,
                },
            );

            await queryInterface.sequelize.query(
                'INSERT INTO features(name, fk_entity, is_writing) VALUES(\'access\', \'action_finances\', false)',
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
                'DELETE FROM features WHERE name = \'access\' AND fk_entity = \'action_finances\'',
                { transaction },
            );

            await queryInterface.sequelize.query(
                'DELETE FROM entity WHERE name = \'action_finances\'',
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
