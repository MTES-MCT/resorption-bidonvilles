import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { AttachmentEntityType } from '#server/models/attachmentModel/createLinkedAttachment';

export default async (
    entityType: AttachmentEntityType,
    entityId: number,
    attachmentId: number,
): Promise<void> => {
    try {
        await sequelize.query(
            `DELETE FROM ${entityType}_attachments WHERE fk_${entityType} = :entityId AND fk_attachment = :attachmentId`,
            {
                type: QueryTypes.DELETE,
                replacements: {
                    entityId,
                    attachmentId,
                },
            },
        );
    } catch (e) {
        throw e;
    }
};
