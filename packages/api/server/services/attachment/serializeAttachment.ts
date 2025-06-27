import fromMimeToExtension from '#server/utils/fromMimeToExtension';
import getSignedUrl from './getSignedUrl';
import { Attachment } from './Attachment.d';

export default async (attachment: string): Promise<Attachment> => {
    const [id, key, previewKey, original_name, mimetype, size, created_by] = attachment.split('@.;.@');

    return {
        state: 'uploaded',
        id: parseInt(id, 10),
        name: original_name,
        size: parseInt(size, 10),
        urls: {
            original: key ? await getSignedUrl(key) : null,
            preview: previewKey ? await getSignedUrl(previewKey) : null,
        },
        extension: fromMimeToExtension[mimetype] ?? 'inconnu',
        created_by,
    };
};
