import { S3 } from '#server/utils/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import config from '#server/config';
import attachmentModel from '#server/models/attachmentModel';
import { AttachmentEntityType } from '#server/models/attachmentModel/createLinkedAttachment';
import fromMimeToExtension from '#server/utils/fromMimeToExtension';
import { Transaction } from 'sequelize';

export default (entityType: AttachmentEntityType, entityId: number, createdBy: number, files: Express.Multer.File[], transaction?: Transaction): Promise<any[]> => Promise.all(
    files.map((f, index) => {
        const Key = `${entityType}_author${createdBy}_comment${entityId}_file${index + 1}.${fromMimeToExtension[f.mimetype]}`;

        return [
            attachmentModel.createLinkedAttachment('shantytown_comment', entityId, Key, f.originalname, f.mimetype, f.size, createdBy, transaction),
            S3.send(new PutObjectCommand({
                Bucket: config.S3.bucket,
                ACL: 'public-read',
                Key,
                Body: f.buffer,
            })),
        ];
    }).flat(),
);
