import { S3 } from '#server/utils/s3';
import sharp from 'sharp';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import config from '#server/config';
import attachmentModel from '#server/models/attachmentModel';
import { AttachmentEntityType } from '#server/models/attachmentModel/createLinkedAttachment';
import fromMimeToExtension from '#server/utils/fromMimeToExtension';
import { Transaction } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { ShantytownAttachmentObject } from '#root/types/resources/Shantytown.d';


export default async (entityType: AttachmentEntityType, entityId: number, createdBy: number, files: Express.Multer.File[], transaction?: Transaction, attachmentType?: ShantytownAttachmentObject[]): Promise<any[]> => {
    const previews: Buffer[] = await Promise.all(
        files.map((f) => {
            if (!f.mimetype.startsWith('image/')) {
                return null;
            }

            return sharp(f.buffer).resize({ width: 50 }).toBuffer();
        }),
    );

    return Promise.all(
        files.map((f, index) => {
            const uid = uuidv4();

            const Key = `${entityType}_author${createdBy}_comment${entityId}_file${index + 1}_${uid}.${fromMimeToExtension[f.mimetype]}`;
            let PreviewKey = null;
            const promises: Promise<any>[] = [
                S3.send(new PutObjectCommand({
                    Bucket: config.S3.bucket,
                    ACL: 'public-read',
                    Key,
                    Body: f.buffer,
                    ContentType: f.mimetype,
                })),
            ];

            if (previews[index] !== null) {
                PreviewKey = `${entityType}_author${createdBy}_comment${entityId}_file${index + 1}_${uid}_min.${fromMimeToExtension[f.mimetype]}`;
                promises.push(
                    S3.send(new PutObjectCommand({
                        Bucket: config.S3.bucket,
                        ACL: 'public-read',
                        Key: PreviewKey,
                        Body: previews[index],
                        ContentType: f.mimetype,
                    })),
                );
            }

            promises.push(
                attachmentModel.createLinkedAttachment(
                    entityType,
                    entityId,
                    Key,
                    PreviewKey,
                    f.originalname,
                    f.mimetype,
                    f.size,
                    createdBy,
                    transaction,
                    attachmentType ? attachmentType[index] : null,
                ),
            );

            return promises;
        }).flat(),
    );
};
