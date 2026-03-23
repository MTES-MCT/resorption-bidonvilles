/**
 * Factory function to create a migration that refreshes a SQL view
 * @param {string} viewName - Name of the view to refresh
 * @param {string} createOldView - SQL query to create the old version of the view
 * @param {string} createNewView - SQL query to create the new version of the view
 * @returns {object} Migration object with up and down methods
 */
module.exports = function refreshView(viewName, createOldView, createNewView) {
    return {
        async up(queryInterface) {
            const transaction = await queryInterface.sequelize.transaction();

            try {
                await queryInterface.sequelize.query(
                    `DROP VIEW ${viewName}`,
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
                    `DROP VIEW ${viewName}`,
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
};
