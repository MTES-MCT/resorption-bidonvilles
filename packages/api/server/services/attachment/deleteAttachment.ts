import { AttachmentKeys } from '#server/models/attachmentModel/findKeys';
import attachmentModel from '#server/models/attachmentModel';
import ServiceError from '#server/errors/ServiceError';
import { S3 } from '#server/utils/s3';
import config from '#server/config';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

export default async (keys: AttachmentKeys): Promise<void> => {
    try {
        await attachmentModel.deleteAttachment(keys.attachment_id);
    } catch (e) {
        throw new ServiceError('delete_failed', e);
    }

    try {
        const promises = [
            S3.send(new DeleteObjectCommand({
                Bucket: config.S3.bucket,
                Key: keys.original_file_key,
            })),
        ];
        if (keys.preview_file_key) {
            promises.push(
                S3.send(new DeleteObjectCommand({
                    Bucket: config.S3.bucket,
                    Key: keys.preview_file_key,
                })),
            );
        }

        await Promise.all(promises);
    } catch (error) {
        throw new ServiceError('bucket_delete_failed', error);
    }
};
