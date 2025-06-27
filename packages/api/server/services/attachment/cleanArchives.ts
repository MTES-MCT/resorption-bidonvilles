import config from '#server/config';
import { S3 } from '#server/utils/s3';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import getArchivedAttachments from '#server/models/attachmentModel/getArchives';
import deleteArchivedAttachments from '#server/models/attachmentModel/deleteArchives';
import mattermost from '#server/utils/mattermost';

export default async () => {
    const attachments = await getArchivedAttachments();
    const deletionResponses = await Promise.all(
        attachments.map((attachment) => {
            const promises = [
                S3.send(new DeleteObjectCommand({
                    Bucket: config.S3.bucket,
                    Key: attachment.key,
                })),
            ];

            if (attachment.previewKey !== null) {
                promises.push(
                    S3.send(new DeleteObjectCommand({
                        Bucket: config.S3.bucket,
                        Key: attachment.previewKey,
                    })),
                );
            }

            return Promise.all(promises).then(() => true).catch(() => false);
        }),
    );

    const attachmentsToBeDeleted = attachments
        .map(attachment => attachment.id)
        .filter((id, index) => deletionResponses[index] === true);

    if (attachmentsToBeDeleted.length > 0) {
        try {
            await deleteArchivedAttachments(attachmentsToBeDeleted);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);

            await mattermost.triggerAttachmentArchiveCleanupError();
        }
    }

    await mattermost.triggerAttachmentArchiveCleanup(
        deletionResponses.length,
        deletionResponses.length - attachmentsToBeDeleted.length,
    );
};
