const createNewViews = require('./common/permission_locations/04_support_multiple_dpt_by_epci');
const createOldViews = require('./common/permission_locations/03_link_to_organizations');

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
                queryInterface.sequelize.query(createOldViews[0], { transaction }),
                queryInterface.sequelize.query(createOldViews[1], { transaction }),
            ]);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
