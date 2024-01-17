const createOldView = require('./common/user_actual_permissions/10_reset');
const createNewView = require('./common/user_actual_permissions/11_support_intervention_areas');

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                'DROP VIEW user_actual_permissions',
                { transaction },
            );
            await queryInterface.sequelize.query(createNewView, { transaction });

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
            await queryInterface.sequelize.query(createOldView, { transaction });

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
