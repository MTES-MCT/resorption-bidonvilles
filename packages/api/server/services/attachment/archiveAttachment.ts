import { AttachmentKeys } from '#server/models/attachmentModel/findKeys';
import ServiceError from '#server/errors/ServiceError';
import archiveAttachment from '#server/models/attachmentModel/archiveAttachment';

export default async (keys: AttachmentKeys): Promise<void> => {
    try {
        await archiveAttachment(keys.attachment_id);
    } catch (e) {
        throw new ServiceError('delete_failed', e);
    }
};
