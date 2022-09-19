const fs = require('fs');
const path = require('path');

const newFunction = fs.readFileSync(
    path.resolve(__dirname, 'common/validate_user_permission_attachments/02_support_plan_comment.sql'),
    'utf8',
);
const oldFunction = fs.readFileSync(
    path.resolve(__dirname, 'common/validate_user_permission_attachments/01_initial_function.sql'),
    'utf8',
);

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.sequelize.query(
            'DROP TRIGGER check_user_permission_attachment ON user_permission_attachments',
            {
                transaction,
            },
        );
        await queryInterface.sequelize.query(newFunction, { transaction });
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
        await queryInterface.sequelize.query(oldFunction, { transaction });
        await queryInterface.sequelize.query(
            `CREATE TRIGGER check_user_permission_attachment BEFORE INSERT OR UPDATE ON user_permission_attachments
                FOR EACH ROW EXECUTE PROCEDURE validate_user_permission_attachments();`,
            {
                transaction,
            },
        );

        return transaction.commit();
    },
};
