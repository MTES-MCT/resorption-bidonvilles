import { AttachmentKeys } from '#server/models/attachmentModel/findKeys';

export default (override: Partial<AttachmentKeys> = {}): AttachmentKeys => ({
    attachment_id: 1,
    original_file_key: 'clé originale',
    preview_file_key: 'clé miniature',
    created_by: 1,
    ...override,
});
