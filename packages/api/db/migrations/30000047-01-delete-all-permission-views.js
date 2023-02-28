const createUserActualPermissions = require('./common/user_actual_permissions/09_support_new_views');
const createUserPermissionsByUser = require('./common/user_permissions_by_user/01_initial_view');
const createUserPermissionsByOrg = require('./common/user_permissions_by_org/01_initial_view');
const createUserPermissionsByOption = require('./common/user_permissions_by_option/02_support_create_shantytown_option');
const createUserPermissionsByRole = require('./common/user_permissions_by_role/01_initial_view');
const createUserPermissionsWithAttachments = require('./common/user_permissions_with_attachments/01_initial_view');
const [createLocalWritingLocations, createLocalReadingLocations] = require('./common/permission_locations/02_support_actions');

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.sequelize.query(
                'DROP VIEW user_actual_permissions',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DROP VIEW user_permissions_by_user',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DROP VIEW user_permissions_by_org',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DROP VIEW user_permissions_by_option',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DROP VIEW user_permissions_by_role',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DROP VIEW user_permissions_with_attachments',
                { transaction },
            );
            await Promise.all([
                queryInterface.sequelize.query(
                    'DROP VIEW local_writing_locations',
                    { transaction },
                ),
                queryInterface.sequelize.query(
                    'DROP VIEW local_reading_locations',
                    { transaction },
                ),
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
                queryInterface.sequelize.query(
                    createLocalWritingLocations,
                    { transaction },
                ),
                queryInterface.sequelize.query(
                    createLocalReadingLocations,
                    { transaction },
                ),
            ]);

            await queryInterface.sequelize.query(
                createUserPermissionsWithAttachments,
                { transaction },
            );
            await queryInterface.sequelize.query(
                createUserPermissionsByRole,
                { transaction },
            );
            await queryInterface.sequelize.query(
                createUserPermissionsByOption,
                { transaction },
            );
            await queryInterface.sequelize.query(
                createUserPermissionsByOrg,
                { transaction },
            );
            await queryInterface.sequelize.query(
                createUserPermissionsByUser,
                { transaction },
            );
            await createUserActualPermissions(queryInterface, transaction);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
