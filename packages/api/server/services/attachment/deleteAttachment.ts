import { AttachmentKeys } from '#server/models/attachmentModel/findKeys';
import attachmentModel from '#server/models/attachmentModel';
import ServiceError from '#server/errors/ServiceError';

export default async (keys: AttachmentKeys): Promise<void> => {
    try {
        await attachmentModel.deleteAttachment(keys.attachment_id);
    } catch (e) {
        throw new ServiceError('delete_failed', e);
    }
};
