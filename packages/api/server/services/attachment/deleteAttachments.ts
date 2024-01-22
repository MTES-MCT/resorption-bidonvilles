import { Transaction } from 'sequelize';
import findKeys, { AttachmentKeys } from '#server/models/attachmentModel/findKeys';
import attachmentModel from '#server/models/attachmentModel';
import ServiceError from '#server/errors/ServiceError';
import { S3 } from '#server/utils/s3';
import config from '#server/config';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

export default async (entityId: number, entityType: string, transaction: Transaction): Promise<void> => {
    let attachmentIds: number[] = [];
    try {
        attachmentIds = await attachmentModel.deleteAttachments(entityId, entityType, transaction);
    } catch (e) {
        throw new ServiceError('delete_failed', e);
    }

    try {
        if (attachmentIds.length > 0) {
            attachmentIds.map(async (attachmentId) => {
                const attachment: AttachmentKeys = await findKeys(attachmentId);
                const promises = [
                    S3.send(new DeleteObjectCommand({
                        Bucket: config.S3.bucket,
                        Key: attachment.original_file_key,
                    })),
                ];
                if (attachment.preview_file_key) {
                    promises.push(
                        S3.send(new DeleteObjectCommand({
                            Bucket: config.S3.bucket,
                            Key: attachment.preview_file_key,
                        })),
                    );
                }

                await Promise.all(promises);
            });
        }
    } catch (error) {
        throw new ServiceError('bucket_delete_failed', error);
    }
};
