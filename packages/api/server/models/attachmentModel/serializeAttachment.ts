import config from '#server/config';
import { File } from '#types/resources/File.d';
import fromMimeToExtension from '#server/utils/fromMimeToExtension';

export default (attachment: string): File => {
    const [id, key, , original_name, mimetype, size, created_by] = attachment.split('@.;.@');
    const url = `${config.S3.endpoint}/${config.S3.bucket}/${key}`;

    return {
        state: 'uploaded',
        id: parseInt(id, 10),
        name: original_name,
        size: parseInt(size, 10),
        urls: {
            original: url,
            preview: url,
        },
        extension: fromMimeToExtension[mimetype] || 'inconnu',
        created_by: parseInt(created_by, 10),
    };
};
