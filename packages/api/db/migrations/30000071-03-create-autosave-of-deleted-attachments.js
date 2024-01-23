module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                `CREATE FUNCTION archive_deleted_attachment() RETURNS TRIGGER AS $$
                BEGIN
                    INSERT INTO attachments_archives (
                        attachment_id,
                        original_file_key,
                        preview_file_key,
                        original_name,
                        mimetype,
                        size,
                        created_by,
                        created_at
                    )
                    VALUES (
                        OLD.attachment_id,
                        OLD.original_file_key,
                        OLD.preview_file_key,
                        OLD.original_name,
                        OLD.mimetype,
                        OLD.size,
                        OLD.created_by,
                        OLD.created_at
                    );
    
                    RETURN OLD;
                END;
                $$ LANGUAGE plpgsql`,
                { transaction },
            );
            await queryInterface.sequelize.query(
                `CREATE TRIGGER archive_deleted_attachment_before_deletion BEFORE DELETE ON attachments
                    FOR EACH ROW EXECUTE PROCEDURE archive_deleted_attachment()`,
                {
                    transaction,
                },
            );

            return transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                'DROP TRIGGER archive_deleted_attachment_before_deletion ON attachments',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DROP FUNCTION archive_deleted_attachment()',
                { transaction },
            );

            return transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
};
