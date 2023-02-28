const createNewViews = require('./common/permission_locations/03_link_to_organizations');

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await Promise.all([
                queryInterface.sequelize.query(createNewViews[0], { transaction }),
                queryInterface.sequelize.query(createNewViews[1], { transaction }),
            ]);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await Promise.all([
                queryInterface.sequelize.query('DROP VIEW local_writing_locations', { transaction }),
                queryInterface.sequelize.query('DROP VIEW local_reading_locations', { transaction }),
            ]);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
