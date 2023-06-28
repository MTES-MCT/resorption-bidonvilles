import getSignedUrl from '#server/utils/attachment/getSignedUrl';
import fromMimeToExtension from '#server/utils/fromMimeToExtension';
import { File } from './File.d';

export default async (attachment: string): Promise<File> => {
    const [id, key, previewKey, original_name, mimetype, size, created_by] = attachment.split('@.;.@');

    const originalUrl = await getSignedUrl(key);
    const previewUrl = previewKey ? await getSignedUrl(previewKey) : null;

    return {
        state: 'uploaded',
        id: parseInt(id, 10),
        name: original_name,
        size: parseInt(size, 10),
        urls: {
            original: originalUrl,
            preview: previewUrl,
        },
        extension: fromMimeToExtension[mimetype] || 'inconnu',
        created_by: parseInt(created_by, 10),
    };
};
