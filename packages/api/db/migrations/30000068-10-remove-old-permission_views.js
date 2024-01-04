const user_permissions_by_option = require('./common/user_permissions_by_option/03_reset');
const full_user_permissions_by_user = require('./common/full_user_permissions_by_user/01_initial_view');
const full_user_permissions_by_organization = require('./common/full_user_permissions_by_organization/01_initial_view');
const user_permissions_with_attachments = require('./common/user_permissions_with_attachments/02_remove-is_cumulative');
const full_user_permissions_by_role = require('./common/full_user_permissions_by_role/02_fix_action_create');
const full_role_permissions = require('./common/full_role_permissions/01_initial_view');
const permission_locations = require('./common/permission_locations/04_support_multiple_dpt_by_epci');

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                'DROP VIEW user_permissions_by_option',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DROP VIEW full_user_permissions_by_user',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DROP VIEW full_user_permissions_by_organization',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DROP VIEW user_permissions_with_attachments',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DROP VIEW full_user_permissions_by_role',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DROP VIEW full_role_permissions',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DROP VIEW attachment_locations',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DROP VIEW local_writing_locations',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DROP VIEW local_reading_locations',
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
            await queryInterface.sequelize.query(permission_locations[0], { transaction });
            await queryInterface.sequelize.query(permission_locations[1], { transaction });
            await queryInterface.sequelize.query(full_role_permissions, { transaction });
            await queryInterface.sequelize.query(full_user_permissions_by_role, { transaction });
            await queryInterface.sequelize.query(user_permissions_with_attachments, { transaction });
            await queryInterface.sequelize.query(full_user_permissions_by_organization, { transaction });
            await queryInterface.sequelize.query(full_user_permissions_by_user, { transaction });
            await queryInterface.sequelize.query(user_permissions_by_option, { transaction });

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
