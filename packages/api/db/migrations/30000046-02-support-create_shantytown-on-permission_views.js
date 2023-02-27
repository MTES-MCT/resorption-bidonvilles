const createActualPermissions = require('./common/user_actual_permissions/09_support_new_views');

const createOldPermissionsByOption = require('./common/user_permissions_by_option/01_original_view');
const createNewPermissionsByOption = require('./common/user_permissions_by_option/02_support_create_shantytown_option');

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.sequelize.query(
                'DROP VIEW user_actual_permissions',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DROP VIEW user_permissions_by_option',
                { transaction },
            );

            await queryInterface.sequelize.query(
                createNewPermissionsByOption,
                { transaction },
            );
            await createActualPermissions(queryInterface, transaction);

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
            await queryInterface.sequelize.query(
                'DROP VIEW user_permissions_by_option',
                { transaction },
            );

            await queryInterface.sequelize.query(
                createOldPermissionsByOption,
                { transaction },
            );
            await createActualPermissions(queryInterface, transaction);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
