const oldViews = require('./common/permission_locations/01_create_original_view');
const newViews = require('./common/permission_locations/02_support_actions');
const createUserActualPermissions = require('./common/user_actual_permissions/07_fix_access_justice_option');

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all(
                newViews.map(sql => queryInterface.sequelize.query(
                    sql,
                    { transaction },
                )),
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
                'DROP VIEW user_actual_permissions',
                { transaction },
            );
            const views = ['local_writing_locations', 'local_reading_locations', 'attachment_locations'];
            await Promise.all(
                views.map(view => queryInterface.sequelize.query(
                    `DROP VIEW ${view}`,
                    { transaction },
                )),
            );

            await Promise.all(
                oldViews.map(sql => queryInterface.sequelize.query(
                    sql,
                    { transaction },
                )),
            );

            await createUserActualPermissions(queryInterface, transaction);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
