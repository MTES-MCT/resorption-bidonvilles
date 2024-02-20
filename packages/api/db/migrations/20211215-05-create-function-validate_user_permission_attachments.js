const createFunction = require('./common/validate_user_permission_attachments/01_initial_function');

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.sequelize.query(createFunction, { transaction });
        await queryInterface.sequelize.query(
            `CREATE TRIGGER check_user_permission_attachment BEFORE INSERT OR UPDATE ON user_permission_attachments
                FOR EACH ROW EXECUTE PROCEDURE validate_user_permission_attachments();`,
            {
                transaction,
            },
        );

        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.sequelize.query(
            'DROP TRIGGER check_user_permission_attachment ON user_permission_attachments',
            {
                transaction,
            },
        );
        await queryInterface.sequelize.query(
            'DROP FUNCTION validate_user_permission_attachments()',
            {
                transaction,
            },
        );

        return transaction.commit();
    },
};
