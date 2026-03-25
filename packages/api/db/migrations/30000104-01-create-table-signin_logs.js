module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.createTable(
                'signin_logs',
                {
                    signin_log_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                        autoIncrement: true,
                    },
                    email: {
                        type: Sequelize.STRING(255),
                        allowNull: false,
                    },
                    fk_user: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    attempted_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    },
                    response_time_ms: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    success: {
                        type: Sequelize.BOOLEAN,
                        allowNull: false,
                    },
                    failure_reason: {
                        type: Sequelize.STRING(50),
                        allowNull: true,
                    },
                    ip_address: {
                        type: Sequelize.STRING(45),
                        allowNull: true,
                    },
                    user_agent: {
                        type: Sequelize.TEXT,
                        allowNull: true,
                    },
                },
                { transaction },
            );

            await queryInterface.addConstraint(
                'signin_logs',
                {
                    fields: ['fk_user'],
                    type: 'foreign key',
                    name: 'fk_signin_logs_user',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'set null',
                    transaction,
                },
            );

            await Promise.all([
                queryInterface.addIndex(
                    'signin_logs',
                    ['email'],
                    {
                        name: 'idx_signin_logs_email',
                        transaction,
                    },
                ),
                queryInterface.addIndex(
                    'signin_logs',
                    ['ip_address'],
                    {
                        name: 'idx_signin_logs_ip',
                        transaction,
                    },
                ),
                queryInterface.addIndex(
                    'signin_logs',
                    ['attempted_at'],
                    {
                        name: 'idx_signin_logs_attempted_at',
                        transaction,
                    },
                ),
                queryInterface.addIndex(
                    'signin_logs',
                    ['success'],
                    {
                        name: 'idx_signin_logs_success',
                        transaction,
                    },
                ),
            ]);

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all([
                queryInterface.removeConstraint(
                    'signin_logs',
                    'fk_signin_logs_user',
                    { transaction },
                ),
                queryInterface.removeIndex(
                    'signin_logs',
                    'idx_signin_logs_email',
                    { transaction },
                ),
                queryInterface.removeIndex(
                    'signin_logs',
                    'idx_signin_logs_ip',
                    { transaction },
                ),
                queryInterface.removeIndex(
                    'signin_logs',
                    'idx_signin_logs_attempted_at',
                    { transaction },
                ),
                queryInterface.removeIndex(
                    'signin_logs',
                    'idx_signin_logs_success',
                    { transaction },
                ),
            ]);

            await queryInterface.dropTable('signin_logs', { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
