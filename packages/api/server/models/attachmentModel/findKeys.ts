import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export type AttachmentKeys = {
    attachment_id: number,
    original_file_key: string,
    preview_file_key: string,
    created_by: number,
};

export default async (attachmentId: number): Promise<AttachmentKeys> => {
    const keys: AttachmentKeys[] = await sequelize.query(
        `SELECT
            attachment_id,
            original_file_key,
            preview_file_key,
            created_by
        FROM attachments
        WHERE attachment_id = :attachmentId`,
        {
            type: QueryTypes.SELECT,
            replacements: { attachmentId },
        },
    );

    if (keys.length !== 1) {
        return null;
    }

    return keys[0];
};
