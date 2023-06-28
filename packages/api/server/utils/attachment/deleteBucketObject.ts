import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { S3 } from '#server/utils/s3';
import config from '#server/config';

export default async (key: string) => {
    const command = new DeleteObjectCommand({
        Bucket: config.S3.bucket,
        Key: key,
    });

    try {
        const response = await S3.send(command);
        console.log(response);
    } catch (err) {
        console.error(err);
    }
};
