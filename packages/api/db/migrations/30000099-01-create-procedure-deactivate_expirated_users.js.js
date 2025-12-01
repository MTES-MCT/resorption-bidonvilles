module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.query(
            `CREATE OR REPLACE FUNCTION deactivate_expired_users()
                RETURNS INTEGER AS $$
                DECLARE
                    updated_count INTEGER;
                BEGIN
                    UPDATE users u
                    SET fk_status = 'inactive',
                        deactivation_type = 'expired',
                        deactivated_at = NOW(),
                        updated_at = NOW()
                    FROM user_accesses ua
                    WHERE u.user_id = ua.fk_user
                    AND u.fk_status = 'new'
                    AND ua.expires_at < NOW() - INTERVAL '3 months';

                    GET DIAGNOSTICS updated_count = ROW_COUNT;

                    RETURN updated_count;
                END;
                $$ LANGUAGE plpgsql;`,
        );
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query('DROP FUNCTION deactivate_expired_users()');
    },
};
