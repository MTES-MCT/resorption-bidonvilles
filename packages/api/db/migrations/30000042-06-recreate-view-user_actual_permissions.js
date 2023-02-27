const createOldView = require('./common/user_actual_permissions/08_support_actions');
const createNewView = require('./common/user_actual_permissions/09_support_new_views');

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                'DROP VIEW user_actual_permissions',
                { transaction },
            );
            await createNewView(queryInterface, transaction);

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
                'DROP VIEW user_actual_permissions',
                { transaction },
            );
            await createOldView(queryInterface, transaction);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
