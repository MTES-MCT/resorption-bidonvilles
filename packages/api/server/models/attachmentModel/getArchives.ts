import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

type AttachmentArchiveRow = {
    id: number;
    key: string;
    previewKey: string | null;
};

export default (): Promise<AttachmentArchiveRow[]> => sequelize.query(
    `SELECT
        attachment_id AS id,
        original_file_key AS key,
        preview_file_key AS "previewKey"
    FROM deleted_attachments
    WHERE deleted_at < NOW() - INTERVAL '72 hours'`,
    {
        type: QueryTypes.SELECT,
    },
);
