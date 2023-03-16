const createUserActualPermissions = require('./common/user_actual_permissions/10_reset');
const createUserPermissionsByOption = require('./common/user_permissions_by_option/03_reset');
const createFullUserPermissionsByUser = require('./common/full_user_permissions_by_user/01_initial_view');
const createFullUserPermissionsByOrganization = require('./common/full_user_permissions_by_organization/01_initial_view');
const createUserPermissionsWithAttachments = require('./common/user_permissions_with_attachments/02_remove-is_cumulative');
const createOldUserPermissionsByRole = require('./common/full_user_permissions_by_role/01_initial_view');
const createNewUserPermissionsByRole = require('./common/full_user_permissions_by_role/02_fix_action_create');

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // on supprime toutes les vues de permission pour recréer full_user_permissions_by_role
            await queryInterface.sequelize.query('DROP VIEW user_actual_permissions', { transaction });
            await queryInterface.sequelize.query('DROP VIEW user_permissions_by_option', { transaction });
            await queryInterface.sequelize.query('DROP VIEW full_user_permissions_by_user', { transaction });
            await queryInterface.sequelize.query('DROP VIEW full_user_permissions_by_organization', { transaction });
            await queryInterface.sequelize.query('DROP VIEW user_permissions_with_attachments', { transaction });
            await queryInterface.sequelize.query('DROP VIEW full_user_permissions_by_role', { transaction });

            // on recrée les vues une par une
            await queryInterface.sequelize.query(createNewUserPermissionsByRole, { transaction });
            await queryInterface.sequelize.query(createUserPermissionsWithAttachments, { transaction });
            await queryInterface.sequelize.query(createFullUserPermissionsByOrganization, { transaction });
            await queryInterface.sequelize.query(createFullUserPermissionsByUser, { transaction });
            await queryInterface.sequelize.query(createUserPermissionsByOption, { transaction });
            await queryInterface.sequelize.query(createUserActualPermissions, { transaction });

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // on supprime toutes les vues de permission pour recréer full_user_permissions_by_role
            await queryInterface.sequelize.query('DROP VIEW user_actual_permissions', { transaction });
            await queryInterface.sequelize.query('DROP VIEW user_permissions_by_option', { transaction });
            await queryInterface.sequelize.query('DROP VIEW full_user_permissions_by_user', { transaction });
            await queryInterface.sequelize.query('DROP VIEW full_user_permissions_by_organization', { transaction });
            await queryInterface.sequelize.query('DROP VIEW user_permissions_with_attachments', { transaction });
            await queryInterface.sequelize.query('DROP VIEW full_user_permissions_by_role', { transaction });

            // on recrée les vues une par une
            await queryInterface.sequelize.query(createOldUserPermissionsByRole, { transaction });
            await queryInterface.sequelize.query(createUserPermissionsWithAttachments, { transaction });
            await queryInterface.sequelize.query(createFullUserPermissionsByOrganization, { transaction });
            await queryInterface.sequelize.query(createFullUserPermissionsByUser, { transaction });
            await queryInterface.sequelize.query(createUserPermissionsByOption, { transaction });
            await queryInterface.sequelize.query(createUserActualPermissions, { transaction });

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
