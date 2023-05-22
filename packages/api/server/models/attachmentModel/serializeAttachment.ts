import config from '#server/config';
import { File } from '#types/resources/File.d';
import fromMimeToExtension from '#server/utils/fromMimeToExtension';

export default (attachment: string): File => {
    const [id, key, previewKey, original_name, mimetype, size, created_by] = attachment.split('@.;.@');
    const baseUrl = `${config.S3.endpoint}/${config.S3.bucket}`;

    return {
        state: 'uploaded',
        id: parseInt(id, 10),
        name: original_name,
        size: parseInt(size, 10),
        urls: {
            original: `${baseUrl}/${key}`,
            preview: previewKey ? `${baseUrl}/${previewKey}` : null,
        },
        extension: fromMimeToExtension[mimetype] || 'inconnu',
        created_by: parseInt(created_by, 10),
    };
};
